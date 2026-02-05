import { useWeb3 } from "@/contexts/Web3Context";
import { Button } from "@/components/ui/button";
import { formatAddress } from "@/lib/web3";
import { Loader2, Wallet, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function WalletConnect() {
  const { account, isConnected, isLoading, error, connectWallet, disconnectWallet, networkInfo } =
    useWeb3();

  if (isLoading) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (isConnected && account) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Wallet className="h-4 w-4" />
            {formatAddress(account)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="px-2 py-1.5 text-sm">
            <p className="font-semibold">Connected</p>
            <p className="text-xs text-muted-foreground">{account}</p>
            {networkInfo && (
              <p className="text-xs text-muted-foreground mt-1">
                Network: {networkInfo.name}
              </p>
            )}
          </div>
          <DropdownMenuItem onClick={disconnectWallet} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={connectWallet} className="gap-2">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
