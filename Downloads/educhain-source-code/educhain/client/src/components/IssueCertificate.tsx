import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeb3 } from "@/contexts/Web3Context";
import { getContractInstance, CONTRACT_ADDRESS, hashCertificateData } from "@/lib/web3";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CertificateFormData {
  certificateId: string;
  recipientAddress: string;
  recipientName: string;
  courseName: string;
  issueDate: string;
  expiryDate: string;
}

export default function IssueCertificate() {
  const { account, isConnected } = useWeb3();
  const [formData, setFormData] = useState<CertificateFormData>({
    certificateId: "",
    recipientAddress: "",
    recipientName: "",
    courseName: "",
    issueDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !account) {
      toast.error("Please connect your wallet first");
      return;
    }

    // Validate form
    if (
      !formData.certificateId ||
      !formData.recipientAddress ||
      !formData.courseName ||
      !formData.expiryDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate Ethereum address
    if (!formData.recipientAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error("Invalid Ethereum address");
      return;
    }

    if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      toast.error("Contract address not configured. Please deploy the contract first.");
      return;
    }

    setIsLoading(true);

    try {
      // Generate certificate hash
      const certificateHash = hashCertificateData({
        certificateId: formData.certificateId,
        recipientName: formData.recipientName,
        courseName: formData.courseName,
        issueDate: formData.issueDate,
      });

      const contract = await getContractInstance(CONTRACT_ADDRESS);
      const tx = await contract.issueCertificate(
        formData.certificateId,
        formData.recipientAddress,
        formData.courseName,
        formData.issueDate,
        formData.expiryDate,
        certificateHash
      );

      toast.loading("Issuing certificate...");
      const receipt = await tx.wait();

      if (receipt) {
        toast.success("Certificate issued successfully!");
        // Reset form
        setFormData({
          certificateId: "",
          recipientAddress: "",
          recipientName: "",
          courseName: "",
          issueDate: new Date().toISOString().split("T")[0],
          expiryDate: "",
        });
      }
    } catch (error: any) {
      console.error("Issue error:", error);
      toast.error(error.message || "Failed to issue certificate");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Issue Certificate</CardTitle>
        <CardDescription>
          Issue a new digital certificate on the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleIssue} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Certificate ID *</label>
              <Input
                type="text"
                name="certificateId"
                placeholder="e.g., CERT-2024-001"
                value={formData.certificateId}
                onChange={handleInputChange}
                disabled={!isConnected || isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient Address *</label>
              <Input
                type="text"
                name="recipientAddress"
                placeholder="0x..."
                value={formData.recipientAddress}
                onChange={handleInputChange}
                disabled={!isConnected || isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient Name</label>
              <Input
                type="text"
                name="recipientName"
                placeholder="Full name"
                value={formData.recipientName}
                onChange={handleInputChange}
                disabled={!isConnected || isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Course Name *</label>
              <Input
                type="text"
                name="courseName"
                placeholder="e.g., Blockchain Development"
                value={formData.courseName}
                onChange={handleInputChange}
                disabled={!isConnected || isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Issue Date</label>
              <Input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleInputChange}
                disabled={!isConnected || isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Expiry Date *</label>
              <Input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                disabled={!isConnected || isLoading}
              />
            </div>
          </div>

          {isConnected && (
            <div className="text-xs text-muted-foreground">
              Connected: {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
            </div>
          )}

          <Button
            type="submit"
            disabled={!isConnected || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Issuing...
              </>
            ) : (
              "Issue Certificate"
            )}
          </Button>

          {!isConnected && (
            <p className="text-sm text-destructive">
              Please connect your wallet to issue certificates
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
