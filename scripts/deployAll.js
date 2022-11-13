// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy("SuperFoodz", "SF", 300000000, 3141592654); // "SuperFoodz" "SF" 300000000 3141592654

  await token.deployed();

  const Croudsale = await hre.ethers.getContractFactory("Croudsale");
  const ICO = await Croudsale.deploy(token.address, "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada");

  await ICO.deployed();

  console.log(
    `Token deployed to ${token.address}`
  );


  console.log(
    `ICO deployed to ${ICO.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat verify --network Mumbai 0x338AaEede69882d750146d9b01B4cb9f055F854d "SuperFoodz" "SF" 300000000 3141592654
// npx hardhat verify --network Mumbai 0x12d5A0A1BC5dd2A7eBE1B4FB54675C07C7FF0419 "0x338AaEede69882d750146d9b01B4cb9f055F854d" "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada"
