// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Bridge = await hre.ethers.getContractFactory("Bridge");
  // const ethereumBridge  = await Bridge.deploy("0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"); // Ethereum Mainnet
  // const avalancheBridge = await Bridge.deploy("0x0A77230d17318075983913bC2145DB16C7366156"); // Avalanche Mainnet
  // const bscBridge       = await Bridge.deploy("0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE"); // Binance Mainnet

  const ethereumBridge  = await Bridge.deploy("0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"); // Ethereum Testnet
  const avalancheBridge = await Bridge.deploy("0x5498BB86BC934c8D34FDA08E81D444153d0D06aD"); // Avalanche Testnet
  const bscBridge       = await Bridge.deploy("0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526"); // Binance Testnet
  // Polygon Mainnet 0xAB594600376Ec9fD91F8e885dADF0CE036862dE0

  // Goerli 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
  // Mumbai 0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
  // BSC Testnet 0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526
  // Avalanche Testnet 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD

  await ethereumBridge.deployed();
  await avalancheBridge.deployed();
  await bscBridge.deployed();

  console.log(`Ethereum bridge deployed to ${ethereumBridge.address}`);
  console.log(`Avalanche bridge deployed to ${avalancheBridge.address}`);
  console.log(`BSC bridge deployed to ${bscBridge.address}`);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
