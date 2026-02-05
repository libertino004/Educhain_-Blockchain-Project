# EduChain - Deployment and Setup Guide

## Project Overview

EduChain is a blockchain-based certificate verification system built on Ethereum (Sepolia Testnet). It allows educational institutions to issue digital certificates as immutable records on the blockchain, which can then be verified by third parties.

## Technology Stack

- **Blockchain**: Ethereum Sepolia Testnet
- **Smart Contract**: Solidity 0.8.0+
- **Frontend**: React 19 + TypeScript
- **Web3 Integration**: Ethers.js 6.x
- **Wallet**: MetaMask
- **Styling**: Tailwind CSS 4 + shadcn/ui

## Prerequisites

Before deploying, ensure you have:

1. **MetaMask Wallet**: Install MetaMask browser extension
2. **Sepolia Testnet ETH**: Get free testnet ETH from a faucet
   - https://www.alchemy.com/faucets/ethereum-sepolia
   - https://sepoliafaucet.com/
3. **Remix IDE**: For smart contract deployment (https://remix.ethereum.org)
4. **Node.js**: v18+ installed locally

## Step 1: Deploy Smart Contract

### Using Remix IDE

1. Go to https://remix.ethereum.org
2. Create a new file: `EduChain.sol`
3. Copy the smart contract code from `contracts/EduChain.sol`
4. Compile the contract:
   - Click "Solidity Compiler" in the left sidebar
   - Select compiler version `0.8.0` or higher
   - Click "Compile EduChain.sol"
5. Deploy the contract:
   - Click "Deploy & Run Transactions" in the left sidebar
   - Select "Injected Provider - MetaMask" as environment
   - Make sure you're on Sepolia Testnet in MetaMask
   - Click "Deploy"
   - Confirm the transaction in MetaMask
6. Copy the deployed contract address

### Contract Address Format
After deployment, you'll receive a contract address like:
```
0x1234567890123456789012345678901234567890
```

## Step 2: Update Frontend Configuration

1. Open `client/src/lib/web3.ts`
2. Find the line:
   ```typescript
   export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
   ```
3. Replace it with your deployed contract address:
   ```typescript
   export const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";
   ```

## Step 3: Run Frontend Locally

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# The app will be available at http://localhost:3000
```

## Step 4: Connect MetaMask

1. Open the application in your browser
2. Click "Connect Wallet" button
3. MetaMask will prompt you to connect
4. Select your account and approve
5. The app will automatically switch to Sepolia Testnet

## Step 5: Use the Application

### For Institutions

1. **Register Institution**:
   - Go to "Register" tab
   - Enter your institution name
   - Click "Register Institution"
   - Confirm the transaction in MetaMask

2. **Get Verified** (Admin Only):
   - Contact the contract owner to verify your institution
   - This can only be done by the contract deployer

3. **Issue Certificates**:
   - Go to "Issue" tab
   - Fill in certificate details:
     - Certificate ID (unique identifier)
     - Recipient Address (Ethereum address)
     - Recipient Name
     - Course Name
     - Issue Date
     - Expiry Date
   - Click "Issue Certificate"
   - Confirm the transaction

### For Verifiers

1. **Verify Certificates**:
   - Go to "Verify" tab
   - Enter the Certificate ID
   - Click "Verify Certificate"
   - View certificate details and validity status

## Smart Contract Functions

### Public Functions

#### `registerInstitution(string _name)`
Register a new educational institution
- **Parameters**: Institution name
- **Returns**: None
- **Events**: `InstitutionRegistered`

#### `verifyInstitution(address _institutionAddress)`
Verify an institution (only owner)
- **Parameters**: Institution address
- **Returns**: None
- **Events**: `InstitutionVerified`

#### `issueCertificate(...)`
Issue a new certificate
- **Parameters**:
  - `_certificateId`: Unique certificate identifier
  - `_recipient`: Recipient's Ethereum address
  - `_courseName`: Name of the course
  - `_issueDate`: Date of issuance
  - `_expiryDate`: Expiration date
  - `_certificateHash`: Hash of certificate document
- **Returns**: None
- **Events**: `CertificateIssued`

#### `revokeCertificate(string _certificateId)`
Revoke an issued certificate
- **Parameters**: Certificate ID
- **Returns**: None
- **Events**: `CertificateRevoked`

#### `verifyCertificate(string _certificateId)`
Verify a certificate's authenticity
- **Parameters**: Certificate ID
- **Returns**: Certificate details (ID, issuer, recipient, course, dates, hash, validity, timestamp)

#### `getInstitutionCertificates(address _institutionAddress)`
Get all certificates issued by an institution
- **Parameters**: Institution address
- **Returns**: Array of certificate IDs

#### `getRecipientCertificates(address _recipientAddress)`
Get all certificates owned by a recipient
- **Parameters**: Recipient address
- **Returns**: Array of certificate IDs

#### `getAllCertificates()`
Get all certificates in the system
- **Returns**: Array of all certificate IDs

#### `isCertificateValid(string _certificateId)`
Check if a certificate is valid
- **Parameters**: Certificate ID
- **Returns**: Boolean (true if valid, false if revoked or not found)

## Testing the System

### Test Scenario 1: Register Institution
1. Connect wallet
2. Go to Register tab
3. Enter "Test University"
4. Click Register Institution
5. Confirm transaction

### Test Scenario 2: Issue Certificate
1. Make sure institution is verified (contact admin)
2. Go to Issue tab
3. Fill in test data:
   - Certificate ID: `CERT-TEST-001`
   - Recipient Address: `0x...` (another account)
   - Course Name: `Blockchain Development`
   - Expiry Date: `2025-12-31`
4. Click Issue Certificate
5. Confirm transaction

### Test Scenario 3: Verify Certificate
1. Go to Verify tab
2. Enter `CERT-TEST-001`
3. Click Verify Certificate
4. View certificate details

## Troubleshooting

### MetaMask Connection Issues
- Ensure MetaMask is installed and unlocked
- Check that you're on Sepolia Testnet
- Try disconnecting and reconnecting

### Contract Not Found
- Verify the contract address in `client/src/lib/web3.ts`
- Ensure the contract was deployed to Sepolia Testnet
- Check Etherscan: https://sepolia.etherscan.io

### Transaction Failures
- Ensure you have enough Sepolia ETH for gas fees
- Check that your institution is verified (for issuing)
- Verify all input fields are correctly formatted

### Wallet Not Connecting
- Refresh the page
- Clear browser cache
- Restart MetaMask
- Ensure you're using a supported browser (Chrome, Firefox, Brave, Edge)

## Security Considerations

1. **Private Keys**: Never share your private keys
2. **Contract Verification**: Always verify contract addresses on Etherscan
3. **Gas Fees**: Monitor gas prices before transactions
4. **Testnet Only**: This is for testing on Sepolia Testnet
5. **Mainnet Deployment**: For production, deploy to Ethereum Mainnet

## File Structure

```
educhain/
├── contracts/
│   └── EduChain.sol          # Smart contract
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WalletConnect.tsx
│   │   │   ├── InstitutionRegister.tsx
│   │   │   ├── IssueCertificate.tsx
│   │   │   └── VerifyCertificate.tsx
│   │   ├── contexts/
│   │   │   └── Web3Context.tsx
│   │   ├── lib/
│   │   │   └── web3.ts
│   │   ├── pages/
│   │   │   └── Home.tsx
│   │   ├── App.tsx
│   │   └── index.css
│   └── index.html
├── package.json
└── DEPLOYMENT_GUIDE.md
```

## Environment Variables

The application uses the following environment variables (injected automatically):
- `VITE_FRONTEND_FORGE_API_URL`: Frontend API URL
- `VITE_FRONTEND_FORGE_API_KEY`: Frontend API Key

## Additional Resources

- **Ethereum Documentation**: https://ethereum.org/en/developers/
- **Solidity Documentation**: https://docs.soliditylang.org/
- **Ethers.js Documentation**: https://docs.ethers.org/v6/
- **MetaMask Documentation**: https://docs.metamask.io/
- **Sepolia Testnet Faucet**: https://sepoliafaucet.com/

## Support and Contributions

For issues or contributions, please refer to the project repository.

## License

This project is licensed under the MIT License.

---

**Last Updated**: February 2024
**Version**: 1.0.0
