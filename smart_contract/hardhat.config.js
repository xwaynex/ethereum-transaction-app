require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Load environment variables

const { INFURA_API_KEY, SIGNER_PRIVATE_KEY } = process.env;


module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`, // No fallback or extra symbols
      accounts: [SIGNER_PRIVATE_KEY], // Directly from .env without modification
      timeout: 200000, // Increase timeout to 200 seconds
    }
  }
};