// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Croudsale = await hre.ethers.getContractFactory("Croudsale");
  const ICO = await Croudsale.deploy("0x946cccD20aac54F991b6b96aa91F666Dc4A487E9");

  await ICO.deployed();

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
