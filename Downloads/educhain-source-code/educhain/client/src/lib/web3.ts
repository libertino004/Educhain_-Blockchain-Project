import { BrowserProvider, Contract, ethers } from "ethers";

// Contract ABI (Application Binary Interface)
export const EDUCHAIN_ABI = [
  {
    inputs: [{ internalType: "string", name: "_name", type: "string" }],
    name: "registerInstitution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_institutionAddress", type: "address" },
    ],
    name: "verifyInstitution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_certificateId", type: "string" },
      { internalType: "address", name: "_recipient", type: "address" },
      { internalType: "string", name: "_courseName", type: "string" },
      { internalType: "string", name: "_issueDate", type: "string" },
      { internalType: "string", name: "_expiryDate", type: "string" },
      { internalType: "string", name: "_certificateHash", type: "string" },
    ],
    name: "issueCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_certificateId", type: "string" }],
    name: "revokeCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_certificateId", type: "string" }],
    name: "verifyCertificate",
    outputs: [
      { internalType: "string", name: "", type: "string" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "bool", name: "", type: "bool" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_institutionAddress", type: "address" },
    ],
    name: "getInstitutionCertificates",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_recipientAddress", type: "address" },
    ],
    name: "getRecipientCertificates",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllCertificates",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_institutionAddress", type: "address" },
    ],
    name: "getInstitution",
    outputs: [
      { internalType: "string", name: "", type: "string" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "bool", name: "", type: "bool" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllInstitutions",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_certificateId", type: "string" }],
    name: "isCertificateValid",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "certificateId",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "issuer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      { indexed: false, internalType: "string", name: "courseName", type: "string" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "CertificateIssued",
    type: "event",
  },
];

// Sepolia Testnet Configuration
export const SEPOLIA_CONFIG = {
  chainId: 11155111,
  chainName: "Sepolia Testnet",
  rpcUrl: "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  blockExplorerUrl: "https://sepolia.etherscan.io",
};

// Contract Address (to be deployed)
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace after deployment

/**
 * Connect to MetaMask wallet
 */
export async function connectWallet(): Promise<string | null> {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    return accounts[0];
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
}

/**
 * Get current connected account
 */
export async function getCurrentAccount(): Promise<string | null> {
  try {
    if (!window.ethereum) {
      return null;
    }

    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error("Error getting current account:", error);
    return null;
  }
}

/**
 * Get provider and signer
 */
export async function getProviderAndSigner() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return { provider, signer };
}

/**
 * Get contract instance
 */
export async function getContractInstance(contractAddress: string) {
  const { signer } = await getProviderAndSigner();
  return new Contract(contractAddress, EDUCHAIN_ABI, signer);
}

/**
 * Switch to Sepolia network
 */
export async function switchToSepoliaNetwork(): Promise<boolean> {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + SEPOLIA_CONFIG.chainId.toString(16) }],
    });

    return true;
  } catch (error: any) {
    if (error.code === 4902) {
      // Network not added, add it
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x" + SEPOLIA_CONFIG.chainId.toString(16),
              chainName: SEPOLIA_CONFIG.chainName,
              rpcUrls: [SEPOLIA_CONFIG.rpcUrl],
              blockExplorerUrls: [SEPOLIA_CONFIG.blockExplorerUrl],
              nativeCurrency: {
                name: "Sepolia Ether",
                symbol: "ETH",
                decimals: 18,
              },
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error("Error adding network:", addError);
        return false;
      }
    }
    console.error("Error switching network:", error);
    return false;
  }
}

/**
 * Get network information
 */
export async function getNetworkInfo() {
  try {
    const { provider } = await getProviderAndSigner();
    const network = await provider.getNetwork();
    return {
      chainId: network.chainId,
      name: network.name,
    };
  } catch (error) {
    console.error("Error getting network info:", error);
    return null;
  }
}

/**
 * Hash certificate data
 */
export function hashCertificateData(data: {
  certificateId: string;
  recipientName: string;
  courseName: string;
  issueDate: string;
}): string {
  const dataString = JSON.stringify(data);
  return ethers.keccak256(ethers.toUtf8Bytes(dataString));
}

/**
 * Format address for display
 */
export function formatAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Declare window.ethereum for TypeScript
 */
declare global {
  interface Window {
    ethereum?: any;
  }
}
