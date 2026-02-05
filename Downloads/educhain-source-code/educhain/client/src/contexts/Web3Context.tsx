import React, { createContext, useContext, useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentAccount,
  getNetworkInfo,
  switchToSepoliaNetwork,
} from "@/lib/web3";

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
  networkInfo: { chainId: number | bigint; name: string } | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkInfo, setNetworkInfo] = useState<{
    chainId: number | bigint;
    name: string;
  } | null>(null);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const currentAccount = await getCurrentAccount();
        if (currentAccount) {
          setAccount(currentAccount);
          setIsConnected(true);

          const network = await getNetworkInfo();
          if (network) {
            setNetworkInfo(network);
          }
        }
      } catch (err) {
        console.error("Error checking connection:", err);
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount(null);
          setIsConnected(false);
        }
      });

      // Listen for chain changes
      window.ethereum.on("chainChanged", async () => {
        const network = await getNetworkInfo();
        if (network) {
          setNetworkInfo(network);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, []);

  const handleConnectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const connectedAccount = await connectWallet();
      if (connectedAccount) {
        setAccount(connectedAccount);
        setIsConnected(true);

        // Switch to Sepolia network
        const switched = await switchToSepoliaNetwork();
        if (switched) {
          const network = await getNetworkInfo();
          if (network) {
            setNetworkInfo(network);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
      console.error("Connection error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setError(null);
  };

  const handleSwitchNetwork = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const switched = await switchToSepoliaNetwork();
      if (switched) {
        const network = await getNetworkInfo();
        if (network) {
          setNetworkInfo(network);
        }
      } else {
        setError("Failed to switch network");
      }
    } catch (err: any) {
      setError(err.message || "Failed to switch network");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected,
        isLoading,
        error,
        connectWallet: handleConnectWallet,
        disconnectWallet: handleDisconnectWallet,
        switchNetwork: handleSwitchNetwork,
        networkInfo,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within Web3Provider");
  }
  return context;
}
