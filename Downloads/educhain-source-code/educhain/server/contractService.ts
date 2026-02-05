import dotenv from "dotenv";
import { ethers } from "ethers";
import contractABI from "./ContractABI.json";

dotenv.config();

const contractAddress = process.env.CONTRACT_ADDRESS;
if (!contractAddress) {
  throw new Error("Contract address not configured. Please deploy the contract first.");
}

const provider = new ethers.JsonRpcProvider("http://localhost:8545");

const contract = new ethers.Contract(contractAddress, contractABI, provider);

export default contract;