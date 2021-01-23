# Ledger

## Document Tree
At its heart, Concords is a Merkle Tree. The data structure behind Git and blockchains such as Bitcoin and Etherum.

### Example Tree

```JSON
{
  "difficulty": 1,
  "pending_transactions": [],
  "chain": [
    {
      "transactions": [
        {
          "action": "create",
          "type": "document",
          "data": {
            "timestamp": 1611439499277,
            "id": "f8f4aab275bd513ab6a99752dc3ac592b58e8ecb91a0f89fd8f354d41ea0dd2b"
          },
          "signature": "zAW6bKSFukZ2FKgvLCIKmtpdpIIBqlaZNWtiKOg/6Q4+YA8tmSKRg5QqxWBjbbED+Tbju9XcGyEJ7wSoPOtr/k8iBzDokqnqHPU5GeokXt/9yViRWPg1ZSRKYSn2dAS9",
          "user": {
            "x": "0EV-1cAHZYaxI4o_XqZ4Os4Agpul6UUqmAdC1r5AZJyJkaEz26_S4YDeqr1n8lPi",
            "y": "HA4Blwp8iTSl5uzbT6JjsC60tAbI33XXuF_-POOYLS2_ksKmellLZc_Vaww4uj4l"
          }
        }
      ],
      "timestamp": 1611439499284,
      "previous_hash": "0",
      "hash": "e82ca7214e7202fb5be54cc28cb9b9cfa71286dec82d9dbcc56ad6b5daf0",
      "nonce": 0
    },
    {
      "transactions": [
        {
          "type": "todos",
          "action": "create",
          "data": {
            "text": "test",
            "created_at": 1611439506216,
            "id": "9a8937be48c93f6a521cdaa4a3f2734c2b1a21385533d9e64cddd3c4e318e7b",
            "timestamp": 1611439506216
          },
          "user": {
            "x": "0EV-1cAHZYaxI4o_XqZ4Os4Agpul6UUqmAdC1r5AZJyJkaEz26_S4YDeqr1n8lPi",
            "y": "HA4Blwp8iTSl5uzbT6JjsC60tAbI33XXuF_-POOYLS2_ksKmellLZc_Vaww4uj4l"
          },
          "signature": "voAWjveBQtuyqjWYOrunBoqoijfQ/U+Gs7ulXhh4MhxJcdRmu43OAgXqk4fKurl03Iphn4YsN/oTp6ofDCIewEJcouATDFq6boXyV3oMidQJRmJvJkIoaw2Ut0cKMZGG"
        }
      ],
      "timestamp": 1611439509877,
      "previous_hash": "e82ca7214e7202fb5be54cc28cb9b9cfa71286dec82d9dbcc56ad6b5daf0",
      "hash": "02bd55b2a423b76c23f79f262a7b656fb5ff9664d428ef9851ef339302736",
      "nonce": 420
    }
  ],
  "id": "e82ca7214e7202fb5be54cc28cb9b9cfa71286dec82d9dbcc56ad6b5daf0"
}
```