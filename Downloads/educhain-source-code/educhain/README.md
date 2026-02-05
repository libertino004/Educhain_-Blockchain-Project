# EduChain - Blockchain-Based Certificate Verification System

![EduChain](https://img.shields.io/badge/Blockchain-Ethereum-blue)
![Solidity](https://img.shields.io/badge/Solidity-0.8.0-red)
![React](https://img.shields.io/badge/React-19-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Overview

EduChain is a decentralized certificate verification system that leverages blockchain technology to create immutable, transparent, and easily verifiable digital certificates. Educational institutions can issue certificates that are permanently recorded on the Ethereum blockchain, and anyone can verify their authenticity without intermediaries.

### Key Features

- **Institution Registration**: Educational institutions can register on the blockchain
- **Certificate Issuance**: Verified institutions can issue digital certificates
- **Immutable Records**: All certificates are permanently stored on the blockchain
- **Public Verification**: Anyone can verify certificate authenticity using a certificate ID
- **Revocation Support**: Institutions can revoke invalid certificates
- **MetaMask Integration**: Seamless wallet connection for transactions
- **Sepolia Testnet**: Built and tested on Ethereum Sepolia Testnet

## Architecture

### Smart Contract (Solidity)

The `EduChain.sol` smart contract manages:
- Institution registration and verification
- Certificate issuance and revocation
- Certificate verification and lookup
- Event logging for all transactions

### Frontend (React + TypeScript)

The frontend provides:
- Wallet connection interface
- Institution registration form
- Certificate issuance interface
- Certificate verification tool
- Real-time transaction status

### Web3 Integration

- **Ethers.js**: For blockchain interactions
- **MetaMask**: For wallet management
- **Sepolia Testnet**: For testing and demonstration

## Quick Start

### Prerequisites

- Node.js v18+
- MetaMask browser extension
- Sepolia Testnet ETH (from faucet)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd educhain

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Deployment

1. Deploy smart contract to Sepolia Testnet using Remix IDE
2. Update `CONTRACT_ADDRESS` in `client/src/lib/web3.ts`
3. Connect MetaMask to Sepolia Testnet
4. Start using the application

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## Usage

### For Institutions

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask
2. **Register**: Go to "Register" tab and enter institution name
3. **Get Verified**: Contact admin to verify your institution
4. **Issue Certificates**: Go to "Issue" tab and fill certificate details
5. **Manage Certificates**: View and revoke issued certificates

### For Certificate Holders

1. **Verify Certificates**: Go to "Verify" tab
2. **Enter Certificate ID**: Input the certificate ID
3. **View Details**: See certificate information and validity status
4. **Share**: Share certificate ID with third parties for verification

## Smart Contract Functions

### Core Functions

| Function | Description | Access |
|----------|-------------|--------|
| `registerInstitution(name)` | Register a new institution | Public |
| `verifyInstitution(address)` | Verify an institution | Owner only |
| `issueCertificate(...)` | Issue a new certificate | Verified institutions |
| `revokeCertificate(id)` | Revoke a certificate | Issuing institution |
| `verifyCertificate(id)` | Verify certificate details | Public (view) |
| `isCertificateValid(id)` | Check certificate validity | Public (view) |

### Getter Functions

- `getInstitutionCertificates(address)`: Get all certificates by institution
- `getRecipientCertificates(address)`: Get all certificates by recipient
- `getAllCertificates()`: Get all certificates in system
- `getInstitution(address)`: Get institution details
- `getAllInstitutions()`: Get all registered institutions

## Project Structure

```
educhain/
├── contracts/
│   └── EduChain.sol                    # Smart contract
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WalletConnect.tsx       # Wallet connection UI
│   │   │   ├── InstitutionRegister.tsx # Institution registration
│   │   │   ├── IssueCertificate.tsx    # Certificate issuance
│   │   │   └── VerifyCertificate.tsx   # Certificate verification
│   │   ├── contexts/
│   │   │   ├── ThemeContext.tsx        # Theme management
│   │   │   └── Web3Context.tsx         # Web3 state management
│   │   ├── lib/
│   │   │   └── web3.ts                 # Web3 utilities
│   │   ├── pages/
│   │   │   └── Home.tsx                # Main page
│   │   ├── App.tsx                     # App root
│   │   └── index.css                   # Global styles
│   └── index.html                      # HTML entry point
├── package.json                        # Dependencies
├── README.md                           # This file
└── DEPLOYMENT_GUIDE.md                 # Deployment instructions
```

## Technology Stack

### Blockchain
- **Network**: Ethereum Sepolia Testnet
- **Language**: Solidity 0.8.0+
- **Standard**: ERC-compliant patterns

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Web3**: Ethers.js 6.x
- **Build Tool**: Vite

### Development
- **Package Manager**: pnpm
- **Node Version**: 18+

## Events

The smart contract emits the following events:

```solidity
event CertificateIssued(
    string indexed certificateId,
    address indexed issuer,
    address indexed recipient,
    string courseName,
    uint256 timestamp
);

event CertificateRevoked(
    string indexed certificateId,
    address indexed issuer,
    uint256 timestamp
);

event InstitutionRegistered(
    address indexed institutionAddress,
    string name,
    uint256 timestamp
);

event InstitutionVerified(
    address indexed institutionAddress,
    uint256 timestamp
);
```

## Security Considerations

- **Verified Institutions Only**: Only verified institutions can issue certificates
- **Owner Controls**: Contract owner can verify institutions
- **Immutable Records**: Certificates cannot be modified, only revoked
- **Public Verification**: Anyone can verify without authentication
- **Gas Optimization**: Efficient contract design for lower transaction costs

## Testing

### Test Network
- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_KEY

### Getting Test ETH
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://faucets.chain.link/sepolia

### Verification
- **Block Explorer**: https://sepolia.etherscan.io

## Roadmap

- [ ] Support for multiple certificate types
- [ ] Certificate templates
- [ ] Batch certificate issuance
- [ ] Advanced analytics dashboard
- [ ] Integration with educational platforms
- [ ] Mainnet deployment
- [ ] Mobile application

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This is a demonstration project built on Sepolia Testnet. It is not recommended for production use without thorough security audits and testing. Use at your own risk.

## Support

For issues, questions, or suggestions, please open an issue in the repository.

## Authors

- **EduChain Team** - Blockchain Certificate Verification System

## Acknowledgments

- Ethereum Foundation
- OpenZeppelin for contract patterns
- Ethers.js community
- React and TypeScript communities

---

**Version**: 1.0.0  
**Last Updated**: February 2024  
**Status**: Active Development
