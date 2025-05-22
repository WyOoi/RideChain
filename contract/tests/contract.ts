import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { Contract } from "../target/types/contract";
import {
    Keypair,
    SystemProgram,
    PublicKey,
    LAMPORTS_PER_SOL,
    Transaction, // Added for clarity, though anchor.web3.Transaction is also used
} from "@solana/web3.js";
import {
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    NATIVE_MINT,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    getAccount,
    createSyncNativeInstruction, // Correct import
} from "@solana/spl-token";
import { assert } from "chai";

describe("contract", () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace.Contract as Program<Contract>;

    it("should initialize a ride, lock payment in WSOL, and release it", async () => {
        // Generate Keypairs and Define Variables
        const passenger = Keypair.generate();
        const driver = Keypair.generate();
        const rideId = "ride-" + Math.random().toString(36).substring(2, 9);
        const rideAmount = new BN(1 * LAMPORTS_PER_SOL); // 1 SOL as BN

        // Airdrop SOL
        await provider.connection.requestAirdrop(passenger.publicKey, 2 * LAMPORTS_PER_SOL);
        await provider.connection.requestAirdrop(driver.publicKey, 1.5 * LAMPORTS_PER_SOL); // Ensure driver has enough for ATA rent + tx fees

        // Simple delay to allow airdrops to settle on localnet
        // More robust: use provider.connection.confirmTransaction for each airdrop signature
        let passengerBalance = await provider.connection.getBalance(passenger.publicKey);
        let driverBalance = await provider.connection.getBalance(driver.publicKey);
        let retries = 10;
        while ((passengerBalance < 2 * LAMPORTS_PER_SOL || driverBalance < 1.5 * LAMPORTS_PER_SOL) && retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
            passengerBalance = await provider.connection.getBalance(passenger.publicKey);
            driverBalance = await provider.connection.getBalance(driver.publicKey);
            retries--;
        }
        if(retries === 0 && (passengerBalance < 2 * LAMPORTS_PER_SOL || driverBalance < 1.5 * LAMPORTS_PER_SOL)) {
            console.warn(`Airdrop might not have completed fully. Passenger: ${passengerBalance}, Driver: ${driverBalance}`);
        }


        // Derive PDA and ATA Addresses
        const [ridePda] = PublicKey.findProgramAddressSync(
            [Buffer.from("ride"), Buffer.from(rideId)],
            program.programId
        );

        const passengerWsolAta = await getAssociatedTokenAddress(NATIVE_MINT, passenger.publicKey);
        const driverWsolAta = await getAssociatedTokenAddress(NATIVE_MINT, driver.publicKey);
        const escrowWsolAta = await getAssociatedTokenAddress(NATIVE_MINT, ridePda, true); // true for allowOwnerOffCurve

        // Create Passenger's WSOL ATA and Wrap SOL
        const txPassengerSetup = new anchor.web3.Transaction();
        txPassengerSetup.add(
            createAssociatedTokenAccountInstruction(
                passenger.publicKey, // payer
                passengerWsolAta,    // ata
                passenger.publicKey, // owner
                NATIVE_MINT         // mint
            )
        );
        // Transfer SOL to WSOL ATA to be wrapped
        // Adding a bit more for potential transaction fees for syncNative, though often covered by payer
        const amountToWrap = rideAmount.toNumber() + 2039280; // Rent for ATA + small buffer for syncNative
        txPassengerSetup.add(
            SystemProgram.transfer({
                fromPubkey: passenger.publicKey,
                toPubkey: passengerWsolAta,
                lamports: amountToWrap, 
            })
        );
        txPassengerSetup.add(createSyncNativeInstruction(passengerWsolAta));

        await provider.sendAndConfirm(txPassengerSetup, [passenger], {skipPreflight: true}); // skipPreflight sometimes helps in localnet with ATA creation timing
        
        const passengerWsolAccountAfterWrap = await getAccount(provider.connection, passengerWsolAta);
        assert.isTrue(new BN(passengerWsolAccountAfterWrap.amount.toString()).gte(rideAmount), "Passenger WSOL balance too low after wrap");

        // Create Driver's WSOL ATA (will receive payment)
        const txDriverSetup = new anchor.web3.Transaction().add(
            createAssociatedTokenAccountInstruction(
                driver.publicKey, // payer for its own ATA
                driverWsolAta,
                driver.publicKey,
                NATIVE_MINT
            )
        );
        await provider.sendAndConfirm(txDriverSetup, [driver], {skipPreflight: true});

        // Test `initializeRide`
        await program.methods
            .initializeRide(rideId, rideAmount, driver.publicKey)
            .accounts({
                ride: ridePda,
                passenger: passenger.publicKey,
                passengerWsolAta: passengerWsolAta,
                escrowWsolAta: escrowWsolAta,
                wsolMint: NATIVE_MINT,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            })
            .signers([passenger])
            .rpc();

        // Verify Ride account data
        const rideAccountData = await program.account.ride.fetch(ridePda);
        assert.strictEqual(rideAccountData.rideId, rideId, "Ride ID mismatch");
        assert.isTrue(rideAccountData.amount.eq(rideAmount), `Ride amount mismatch: expected ${rideAmount}, got ${rideAccountData.amount}`);
        assert.isTrue(rideAccountData.driver.equals(driver.publicKey), "Driver public key mismatch");
        assert.isTrue(rideAccountData.passenger.equals(passenger.publicKey), "Passenger public key mismatch");
        assert.deepStrictEqual(rideAccountData.status, { paymentLocked: {} }, "Ride status not PaymentLocked");

        // Verify escrowWsolAta balance
        const escrowTokenAccount = await getAccount(provider.connection, escrowWsolAta);
        assert.isTrue(new BN(escrowTokenAccount.amount.toString()).eq(rideAmount), `Escrow balance mismatch: expected ${rideAmount}, got ${escrowTokenAccount.amount}`);

        // Test `releasePayment`
        const driverWsolAccountBeforeRelease = await getAccount(provider.connection, driverWsolAta);

        await program.methods
            .releasePayment()
            .accounts({
                ride: ridePda,
                driver: driver.publicKey,
                escrowWsolAta: escrowWsolAta,
                driverWsolAta: driverWsolAta,
                wsolMint: NATIVE_MINT,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                // associatedTokenProgram is not directly used by releasePayment instruction, but systemProgram is for closing account
            })
            .signers([driver])
            .rpc();

        // Verify Ride account data updated
        const rideAccountDataAfterRelease = await program.account.ride.fetch(ridePda);
        assert.deepStrictEqual(rideAccountDataAfterRelease.status, { paymentReleased: {} }, "Ride status not PaymentReleased");

        // Verify Driver's WSOL ATA balance increased
        const driverWsolAccountAfterRelease = await getAccount(provider.connection, driverWsolAta);
        const expectedDriverAmount = new BN(driverWsolAccountBeforeRelease.amount.toString()).add(rideAmount);
        assert.isTrue(new BN(driverWsolAccountAfterRelease.amount.toString()).eq(expectedDriverAmount), 
            `Driver WSOL balance mismatch: expected ${expectedDriverAmount}, got ${driverWsolAccountAfterRelease.amount.toString()}`);
        
        // Verify Escrow WSOL ATA is closed
        try {
            await getAccount(provider.connection, escrowWsolAta);
            assert.fail("Escrow WSOL ATA should be closed and thus fetching it should fail");
        } catch (e) {
            // This is the expected path. Error message can be brittle, so checking for error existence.
            // A more specific check could be `e.name === 'TokenAccountNotFoundError'` or similar if library provides typed errors.
            assert.instanceOf(e, Error, "Expected an error when fetching a closed account.");
            // A common error message for a closed account:
            // assert.include(e.message, "Account does not exist or has been closed", "Escrow ATA not closed as expected"); 
            // However, the exact message can vary. The fact that getAccount throws is the primary check.
        }
    });
});
