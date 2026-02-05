import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeb3 } from "@/contexts/Web3Context";
import { getContractInstance, CONTRACT_ADDRESS } from "@/lib/web3";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function InstitutionRegister() {
  const { account, isConnected } = useWeb3();
  const [institutionName, setInstitutionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !account) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!institutionName.trim()) {
      toast.error("Please enter institution name");
      return;
    }

    if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      toast.error("Contract address not configured. Please deploy the contract first.");
      return;
    }

    setIsLoading(true);

    try {
      const contract = await getContractInstance(CONTRACT_ADDRESS);
      const tx = await contract.registerInstitution(institutionName);
      
      toast.loading("Registering institution...");
      const receipt = await tx.wait();
      
      if (receipt) {
        toast.success("Institution registered successfully!");
        setInstitutionName("");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to register institution");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Register Institution</CardTitle>
        <CardDescription>
          Register your educational institution on the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Institution Name</label>
            <Input
              type="text"
              placeholder="Enter your institution name"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              disabled={!isConnected || isLoading}
            />
          </div>

          {isConnected && (
            <div className="text-xs text-muted-foreground">
              Connected: {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
            </div>
          )}

          <Button
            type="submit"
            disabled={!isConnected || isLoading || !institutionName.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register Institution"
            )}
          </Button>

          {!isConnected && (
            <p className="text-sm text-destructive">
              Please connect your wallet to register
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
