export const IDL = {
  "version": "0.1.0",
  "name": "contract",
  "instructions": [
    {
      "name": "initializeRide",
      "accounts": [
        {
          "name": "ride",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "passenger",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "driver",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "releasePayment",
      "accounts": [
        {
          "name": "ride",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "passenger",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "driver",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createOrUpdateRide",
      "accounts": [
        {
          "name": "ride",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "driver",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "rideId",
          "type": "string"
        },
        {
          "name": "origin",
          "type": "string"
        },
        {
          "name": "destination",
          "type": "string"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "date",
          "type": "string"
        },
        {
          "name": "time",
          "type": "string"
        },
        {
          "name": "seats",
          "type": "u8"
        },
        {
          "name": "state",
          "type": "string"
        },
        {
          "name": "university",
          "type": "string"
        },
        {
          "name": "rideType",
          "type": "string"
        },
        {
          "name": "status",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateRideStatus",
      "accounts": [
        {
          "name": "ride",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "driver",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "rideId",
          "type": "string"
        },
        {
          "name": "status",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Ride",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "driver",
            "type": "publicKey"
          },
          {
            "name": "passenger",
            "type": "publicKey"
          },
          {
            "name": "origin",
            "type": "string"
          },
          {
            "name": "destination",
            "type": "string"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "date",
            "type": "string"
          },
          {
            "name": "time",
            "type": "string"
          },
          {
            "name": "seats",
            "type": "u8"
          },
          {
            "name": "state",
            "type": "string"
          },
          {
            "name": "university",
            "type": "string"
          },
          {
            "name": "rideType",
            "type": "string"
          },
          {
            "name": "status",
            "type": "string"
          },
          {
            "name": "paymentStatus",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidStatus",
      "msg": "Invalid ride status for this operation"
    },
    {
      "code": 6001,
      "name": "Unauthorized",
      "msg": "Unauthorized to perform this action"
    }
  ]
}; 