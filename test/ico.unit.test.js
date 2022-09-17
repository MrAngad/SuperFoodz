const { time, loadFixture, } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect }   = require("chai");
require("dotenv").config();

const name          = "SuperFoodz";
const symbol        = "SF";
const decimals      = 18;
const supply        = 3141592654;
const initialSupply = 300000000;

const DEPLOYER_WALLET = process.env.ACCOUNT;
const ZERO_ADDRESS    = "0x0000000000000000000000000000000000000000";
const DECIMAL_ZEROS   = "000000000000000000";

describe("UnitTest original code", function () {
  async function deployToken() {
    const [owner, otherAccount] = await ethers.getSigners();

    // Impersonate owner account
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DEPLOYER_WALLET],
    });

    const deployer = await ethers.provider.getSigner(DEPLOYER_WALLET);

    await network.provider.send("hardhat_setBalance", [
      DEPLOYER_WALLET, 
      ethers.utils.parseEther('10.0').toHexString(),
    ]);

    const Token = await ethers.getContractFactory("SFToken");
    const token = await Token.connect(deployer).deploy("SuperFoodz", "SF", 300000000, 3141592654);

    const PaymentToken = await ethers.getContractFactory("SFToken");
    const paymentToken = await PaymentToken.connect(deployer).deploy("SuperFoodz", "SF", 300000000, 3141592654);

    const ICO = await ethers.getContractFactory("Croudsale");
    const ico = await ICO.connect(deployer).deploy(token.address);

    return { ico, token, paymentToken, deployer, otherAccount };
  }

  describe("ICO ", function () {
    it("SF Token address set correctly", async function () {
      const { ico, token, paymentToken, deployer, otherAccount } = await loadFixture(deployToken);
      expect(await ico.saleTokenAddress()).to.equal(token.address);
    });
    it("SF Token decimals set correctly", async function () {
      const { ico, token, paymentToken, deployer, otherAccount } = await loadFixture(deployToken);
      expect(await ico.saleTokenDecimals()).to.equal(decimals);
    });
    it("setSaleTokenParams", async function () {
      const { ico, token, paymentToken, deployer, otherAccount } = await loadFixture(deployToken);
      const _totalTokensforSale = 10 + DECIMAL_ZEROS;
      const _rate = 2 + DECIMAL_ZEROS;
      await token.approve(ico.address, _totalTokensforSale);
      await ico.setSaleTokenParams(_totalTokensforSale, _rate);
      expect(await ico.rate()).to.equal(_rate);
      expect(await ico.rate()).to.equal(_rate);

    });
    it("setSaleTokenParams", async function () {
      const { ico, token, paymentToken, deployer, otherAccount } = await loadFixture(deployToken);
      const _totalTokensforSale = 10 + DECIMAL_ZEROS;
      const _rate = 2 + DECIMAL_ZEROS;
      await token.approve(ico.address, _totalTokensforSale);
      await ico.setSaleTokenParams(_totalTokensforSale, _rate);
    });
  });
});