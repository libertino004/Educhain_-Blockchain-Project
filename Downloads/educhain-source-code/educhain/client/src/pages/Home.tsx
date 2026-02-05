import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WalletConnect from "@/components/WalletConnect";
import InstitutionRegister from "@/components/InstitutionRegister";
import IssueCertificate from "@/components/IssueCertificate";
import VerifyCertificate from "@/components/VerifyCertificate";
import { Award, CheckCircle, Building2, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">EduChain</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Blockchain Certificate Verification
              </p>
            </div>
          </div>
          <WalletConnect />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Secure Digital Certificates on Blockchain
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            EduChain enables educational institutions to issue, verify, and manage digital
            certificates on the Ethereum blockchain. Certificates are immutable, transparent, and
            easily verifiable by anyone.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg w-fit mb-4">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Institution Registration
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Register your educational institution on the blockchain
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg w-fit mb-4">
              <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Issue Certificates
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Create and issue digital certificates with immutable records
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg w-fit mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Verify Certificates
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Verify the authenticity of any certificate on the blockchain
            </p>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <Tabs defaultValue="verify" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="verify" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Verify</span>
              </TabsTrigger>
              <TabsTrigger value="register" className="gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Register</span>
              </TabsTrigger>
              <TabsTrigger value="issue" className="gap-2">
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Issue</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="verify" className="mt-6">
              <VerifyCertificate />
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <InstitutionRegister />
            </TabsContent>

            <TabsContent value="issue" className="mt-6">
              <IssueCertificate />
            </TabsContent>
          </Tabs>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-950 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Getting Started
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>
              ✓ Connect your MetaMask wallet to the Sepolia Testnet
            </li>
            <li>
              ✓ Register your institution (requires contract deployment)
            </li>
            <li>
              ✓ Issue certificates to students
            </li>
            <li>
              ✓ Anyone can verify certificates using the certificate ID
            </li>
          </ul>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-4">
            <strong>Note:</strong> This is a demonstration on Sepolia Testnet. Deploy the smart
            contract using Remix and update the CONTRACT_ADDRESS in the code.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>EduChain © 2024 - Blockchain-Based Certificate Verification System</p>
          <p className="mt-2">
            Built with Solidity, Ethers.js, and React on Ethereum Sepolia Testnet
          </p>
        </div>
      </footer>
    </div>
  );
}
