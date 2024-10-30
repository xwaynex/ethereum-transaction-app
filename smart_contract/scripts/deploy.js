const hre = require("hardhat");

const main = async () => {
  try {
    console.log("Starting deployment...");

    // Log Contract Factory
    const Transactions = await hre.ethers.getContractFactory("Transactions");
    console.log("Contract factory obtained.");

    // Deploy the contract and log the transaction
    const transactions = await Transactions.deploy();
    console.log("Contract deployment transaction sent.");

    // Wait for deployment confirmation and get the contract address
    await transactions.waitForDeployment();
    const contractAddress = await transactions.getAddress();
    console.log("Contract deployed to:", contractAddress);
  } catch (error) {
    console.error("Error during deployment:", error);
    throw error;
  }
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
