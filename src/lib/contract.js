// Contract configuration and ABI
export const contractAddress = import.meta.env.VITE_POLYGON_AMOY_CONTRACT_ADDRESS || '0x36b2DCc358acAd4e6c5292A3E9997BbB08099eF5'

export const contractABI = [
  {
    "inputs": [
      {
        "internalType": "enum AgriProduceTrace.Role",
        "name": "role",
        "type": "uint8"
      }
    ],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "enum AgriProduceTrace.Role",
        "name": "newRole",
        "type": "uint8"
      }
    ],
    "name": "changeUserRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "originFarm",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "grade",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "string[]",
        "name": "imageURIs",
        "type": "string[]"
      }
    ],
    "name": "registerProduce",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "produceId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "requestTransfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "produceId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "newPrice",
        "type": "uint256"
      },
      {
        "internalType": "enum AgriProduceTrace.ProduceStatus",
        "name": "newStatus",
        "type": "uint8"
      }
    ],
    "name": "claimProduce",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "produceId",
        "type": "uint256"
      }
    ],
    "name": "traceProduce",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "originFarm",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "grade",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "harvestTime",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "currentOwner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "currentPrice",
        "type": "uint256"
      },
      {
        "internalType": "enum AgriProduceTrace.ProduceStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "string[]",
        "name": "imageURIs",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "myProduce",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "userRoles",
    "outputs": [
      {
        "internalType": "enum AgriProduceTrace.Role",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "produceId",
        "type": "uint256"
      }
    ],
    "name": "getStatus",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "produceCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

// Enums for roles and status
export const UserRole = {
  NONE: 0,
  FARMER: 1,
  DISTRIBUTOR: 2,
  RETAILER: 3,
  CONSUMER: 4
}

export const ProduceStatus = {
  HARVESTED: 0,
  IN_TRANSIT: 1,
  AT_RETAIL: 2,
  SOLD: 3
}

export const getUserRoleText = (role) => {
  switch (role) {
    case UserRole.FARMER: return 'Farmer'
    case UserRole.DISTRIBUTOR: return 'Distributor'
    case UserRole.RETAILER: return 'Retailer'
    case UserRole.CONSUMER: return 'Consumer'
    default: return 'Unregistered'
  }
}

export const getStatusText = (status) => {
  switch (status) {
    case ProduceStatus.HARVESTED: return 'Harvested'
    case ProduceStatus.IN_TRANSIT: return 'In Transit'
    case ProduceStatus.AT_RETAIL: return 'At Retail'
    case ProduceStatus.SOLD: return 'Sold'
    default: return 'Unknown'
  }
}