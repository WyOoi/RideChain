export type Contract = {
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
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "driver",
          "type": "publicKey"
        },
        {
          "name": "passenger",
          "type": "publicKey"
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
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "Ride",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rideId",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
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
            "name": "status",
            "type": {
              "defined": "RideStatus"
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "RideStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "PaymentLocked"
          },
          {
            "name": "PaymentReleased"
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

export const IDL: Contract = {
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
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "driver",
          "type": "publicKey"
        },
        {
          "name": "passenger",
          "type": "publicKey"
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
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "Ride",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rideId",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
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
            "name": "status",
            "type": {
              "defined": "RideStatus"
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "RideStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "PaymentLocked"
          },
          {
            "name": "PaymentReleased"
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