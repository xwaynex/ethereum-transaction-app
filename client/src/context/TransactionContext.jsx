import { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "../utils/constants";
import PropTypes from "prop-types";

export const TransactionContext = createContext();

const getEthereumContract = async () => {
  let provider;
  let signer;

  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // Use Ethers.js v6 BrowserProvider
    provider = new ethers.BrowserProvider(window.ethereum);

    // Request account access if needed
    await provider.send("eth_requestAccounts", []);

    // Get the signer
    signer = await provider.getSigner();

    // Initialize the contract instance
    const transactionContract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    return transactionContract;
  } else {
    console.error("MetaMask is not installed or Ethereum object is undefined");
    return null;
  }
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isloading, setIsloading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transationCount")
  );
  const [transactions, setTransactions] = useState([])

  const handleChange = (e, name) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: e.target.value || "",
    }));
  };

  const getAllTransactions = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask");
      const transactionContract = await getEthereumContract();
      console.log("Transaction contract:", transactionContract);

      const availableTransactions = await transactionContract.getAllTransactions();
      console.log("Available transations:", availableTransactions);

      const structuredTransactions = availableTransactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(Number(transaction.timestamp) * 1000).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: ethers.formatEther(transaction.amount.toString()), // Convert BigInt to ether
      }));
      
      console.log(structuredTransactions);
      setTransactions(structuredTransactions)
      
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not installed");

      // Get the provider and accounts
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_accounts", []);

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        console.log("Connected account:", accounts[0]);
        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.error("Error in checking wallet connection:", error);
      alert(error.message || "An unexpected error occurred");
    }
  };

  const checkIfTransactionsExist = async () => {
    try {
      const transactionContract = await getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount();
      window.localStorage.setItem("transactionCount", transactionCount);
    } catch (error) {
      console.log(error);

      throw new Error("No Ethereum object.");
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setCurrentAccount(accounts[0]);
      console.log("Connected account:", accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw new Error("No Ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask");

      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = await getEthereumContract();

      // Parse the amount to wei (bigint in Ethers v6)
      const parsedAmount = ethers.parseEther(amount);

      // Convert parsedAmount to hex format using ethers.toBeHex
      const hexAmount = ethers.toBeHex(parsedAmount);

      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", // 21000 Gwei
            value: hexAmount, //0.00001
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockChain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );

      setIsloading(true);
      console.log(`loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsloading(false);
      console.log(`Success - ${transactionHash.hash}`);

      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(Number(transactionCount));

      window.reload();
    } catch (error) {
      console.log("Error sending transaction:", error);
      throw new Error("No Ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        sendTransaction,
        transactions,
        isloading,
        transactionCount,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// Add PropTypes validation for children
TransactionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};