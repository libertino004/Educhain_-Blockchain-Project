import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeb3 } from "@/contexts/Web3Context";
import { getContractInstance, CONTRACT_ADDRESS, formatAddress } from "@/lib/web3";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface CertificateDetails {
  certificateId: string;
  issuer: string;
  recipient: string;
  courseName: string;
  issueDate: string;
  expiryDate: string;
  certificateHash: string;
  isValid: boolean;
  issuedAt: number;
}

export default function VerifyCertificate() {
  const { isConnected } = useWeb3();
  const [certificateId, setCertificateId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [certificateDetails, setCertificateDetails] = useState<CertificateDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!certificateId.trim()) {
      toast.error("Please enter a certificate ID");
      return;
    }

    if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      toast.error("Contract address not configured. Please deploy the contract first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCertificateDetails(null);

    try {
      const contract = await getContractInstance(CONTRACT_ADDRESS);
      const result = await contract.verifyCertificate(certificateId);

      const details: CertificateDetails = {
        certificateId: result[0],
        issuer: result[1],
        recipient: result[2],
        courseName: result[3],
        issueDate: result[4],
        expiryDate: result[5],
        certificateHash: result[6],
        isValid: result[7],
        issuedAt: Number(result[8]),
      };

      setCertificateDetails(details);
      toast.success("Certificate verified successfully!");
    } catch (error: any) {
      console.error("Verification error:", error);
      const errorMessage =
        error.reason || error.message || "Certificate not found or invalid";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle>Verify Certificate</CardTitle>
          <CardDescription>
            Enter a certificate ID to verify its authenticity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Certificate ID</label>
              <Input
                type="text"
                placeholder="e.g., CERT-2024-001"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Certificate"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {certificateDetails && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <CardTitle className="text-green-900 dark:text-green-100">
                Certificate Valid
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Certificate ID</p>
                <p className="text-foreground break-all">
                  {certificateDetails.certificateId}
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Course Name</p>
                <p className="text-foreground">{certificateDetails.courseName}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Issuer</p>
                <p className="text-foreground">
                  {formatAddress(certificateDetails.issuer)}
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Recipient</p>
                <p className="text-foreground">
                  {formatAddress(certificateDetails.recipient)}
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Issue Date</p>
                <p className="text-foreground">{certificateDetails.issueDate}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Expiry Date</p>
                <p className="text-foreground">{certificateDetails.expiryDate}</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-medium text-muted-foreground">Certificate Hash</p>
                <p className="text-foreground text-xs break-all font-mono">
                  {certificateDetails.certificateHash}
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Issued At</p>
                <p className="text-foreground">
                  {new Date(certificateDetails.issuedAt * 1000).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Status</p>
                <p className="text-foreground font-semibold text-green-600 dark:text-green-400">
                  {certificateDetails.isValid ? "Valid" : "Revoked"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <CardTitle className="text-red-900 dark:text-red-100">
                Certificate Not Found
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
