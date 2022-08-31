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

    return { token, deployer, otherAccount };
  }

  // describe("On Deployment", function () {
  //   it("Should set the correct name", async function () {
  //     const { token } = await loadFixture(deployToken);
  //     expect(await token.name()).to.equal(name);
  //   });
  //   it("Should set the correct symbol", async function () {
  //     const { token } = await loadFixture(deployToken);
  //     expect(await token.symbol()).to.equal(symbol);
  //   });
  //   it("Should set the correct decimals", async function () {
  //     const { token } = await loadFixture(deployToken);
  //     expect(await token.decimals()).to.equal(decimals);
  //   });
  //   it("Should set the correct supply", async function () {
  //     const { token } = await loadFixture(deployToken);
  //     expect(await token.totalSupply() / 10 ** 18).to.equal(supply);
  //   });
  //   it("Owner set correctly", async function () {
  //     const { token } = await loadFixture(deployToken);
  //     expect(await token.owner()).to.equal(DEPLOYER_WALLET);
  //   });
  //   it("Total supply minted to owner's wallet", async function () {
  //     const { token } = await loadFixture(deployToken);
  //     expect(await token.balanceOf(DEPLOYER_WALLET) / 10 ** 18).to.equal(supply);
  //   });
  //   it("Initial Fee should be set correctly", async function () {
  //     const { token } = await loadFixture(deployToken);
  //     const fees = await token.getFees();
  //     expect(fees[0]).to.equal(feeEnabled);
  //     expect(fees[1]).to.equal(buybackFee);
  //     expect(fees[2]).to.equal(reflectionFee);
  //     expect(fees[3]).to.equal(marketingFee);
  //     expect(fees[4]).to.equal(rndFee);
  //     expect(fees[5]).to.equal(liquidityFee);
  //     expect(fees[6]).to.equal(feeDenominator);
  //   });
  //   it("Initial Fee receivers should be set correctly", async function () {
  //     const { token } = await loadFixture(deployToken);
  //     expect(await token.autoLiquidityReceiver()).to.equal(DEPLOYER_WALLET);
  //     expect(await token.marketingFeeReceiver()).to.equal(initial_marketingFeeReceiver);
  //     expect(await token.rndFeeReceiver()).to.equal(initial_rndFeeReceiver);
  //   });
  //   it("Initial autobuyBack settings should be set correctly", async function () {
  //     const { token } = await loadFixture(deployToken);
  //     const fees = await token.getAutoBuybackSettings();
  //     expect(fees[0]).to.equal(false);
  //     expect(fees[1]).to.equal(0);
  //     expect(fees[2]).to.equal(0);
  //     expect(fees[3]).to.equal(0);
  //     expect(fees[4]).to.equal(0);
  //     expect(fees[5]).to.equal(0);
  //   });
  // });

  describe("ERC20 Functions", function () {
    it("name()", async function () {
      const { token } = await loadFixture(deployToken);
      expect(await token.name()).to.equal(name);
    });
    it("symbol()", async function () {
      const { token } = await loadFixture(deployToken);
      expect(await token.symbol()).to.equal(symbol);
    });
    it("decimals()", async function () {
      const { token } = await loadFixture(deployToken);
      expect(await token.decimals()).to.equal(decimals);
    });
    it("supply()", async function () {
      const { token } = await loadFixture(deployToken);
      // expect(await token.totalSupply() / 10 ** 18).to.equal(initialSupply);
    });
    it("balanceOf()", async function () {
      const { token } = await loadFixture(deployToken);
      expect(await token.balanceOf(DEPLOYER_WALLET) / 10 ** 18).to.equal(initialSupply);
    });
    it("transfer()", async function () {
      const { 
        token, 
        deployer, 
        liquidityReceiver, 
        marketingFeeReceiver, 
        rndFeeReceiver, 
        otherAccount  
      } = await loadFixture(deployToken);
      await expect(token.connect(deployer).transfer(otherAccount.address, 1)).to.changeTokenBalances(
        token,
        [DEPLOYER_WALLET, otherAccount.address],
        [-1, 1]
      );
      await expect(token.connect(deployer).transfer(ZERO_ADDRESS, 1)).to.be.revertedWith("ERC20: transfer to the zero address");
    });
    it("allowance()", async function () {
      const { 
        token, 
        deployer, 
        liquidityReceiver, 
        marketingFeeReceiver, 
        rndFeeReceiver, 
        otherAccount  
      } = await loadFixture(deployToken);
      expect(await token.allowance(DEPLOYER_WALLET, otherAccount.address)).to.equal(0);
      await token.connect(deployer).approve(otherAccount.address, 10);
      expect(await token.allowance(DEPLOYER_WALLET, otherAccount.address)).to.equal(10);

    });
    it("approve()", async function () {
      const { 
        token, 
        deployer, 
        liquidityReceiver, 
        marketingFeeReceiver, 
        rndFeeReceiver, 
        otherAccount  
      } = await loadFixture(deployToken);
      expect(await token.allowance(DEPLOYER_WALLET, otherAccount.address)).to.equal(0);
      await token.connect(deployer).approve(otherAccount.address, 10);
      expect(await token.allowance(DEPLOYER_WALLET, otherAccount.address)).to.equal(10);

    });
    it("transferFrom()", async function () {
      const { 
        token, 
        deployer, 
        liquidityReceiver, 
        marketingFeeReceiver, 
        rndFeeReceiver, 
        otherAccount  
      } = await loadFixture(deployToken);
      expect(await token.allowance(DEPLOYER_WALLET, otherAccount.address)).to.equal(0);
      await token.connect(deployer).approve(otherAccount.address, 10);
      expect(await token.allowance(DEPLOYER_WALLET, otherAccount.address)).to.equal(10);

      await expect(token.connect(otherAccount).transferFrom(ZERO_ADDRESS, otherAccount.address, 1)).to.be.revertedWith("ERC20: insufficient allowance");
      await expect(token.connect(otherAccount).transferFrom(DEPLOYER_WALLET, ZERO_ADDRESS, 1)).to.be.revertedWith("ERC20: transfer to the zero address");

      await expect(token.connect(otherAccount).transferFrom(DEPLOYER_WALLET, otherAccount.address, 10)).to.changeTokenBalances(
        token,
        [DEPLOYER_WALLET, otherAccount.address],
        [-10, 10]
      );

    });
  });
  describe("Ownable Functions", function () {
    it("owner()", async function () {
      const { token } = await loadFixture(deployToken);
      expect(await token.owner()).to.equal(DEPLOYER_WALLET);
    });
    it("transferOwnership()", async function () {
      const { 
        token, 
        deployer, 
        liquidityReceiver, 
        marketingFeeReceiver, 
        rndFeeReceiver, 
        otherAccount  
      } = await loadFixture(deployToken);
      await expect(token.connect(otherAccount).transferOwnership(otherAccount.address)).to.be.revertedWith('Ownable: caller is not the owner');
      await token.connect(deployer).transferOwnership(otherAccount.address);
      expect(await token.owner()).to.equal(otherAccount.address);
    });
    it("renounceOwnership()", async function () {
      const { 
        token, 
        deployer, 
        liquidityReceiver, 
        marketingFeeReceiver, 
        rndFeeReceiver, 
        otherAccount  
      } = await loadFixture(deployToken);
      await expect(token.connect(otherAccount).renounceOwnership()).to.be.revertedWith('Ownable: caller is not the owner');
      await token.connect(deployer).renounceOwnership();
      expect(await token.owner()).to.equal(ZERO_ADDRESS);
    });
  });
  describe("Mint Functions", function () {
    it("mint()", async function () {
      const { token, deployer } = await loadFixture(deployToken);
      await expect(token.connect(deployer).mint(DEPLOYER_WALLET, 1000)).to.changeTokenBalance(
        token,
        DEPLOYER_WALLET,
        '1000' + DECIMAL_ZEROS
      );
    });
  });
  describe("Burn Functions", function () {
    it("burn()", async function () {
      const { token, deployer } = await loadFixture(deployToken);
      await expect(token.connect(deployer).burn(1000)).to.changeTokenBalance(
        token,
        DEPLOYER_WALLET,
        -1000
      );
    });
    it("burnFrom()", async function () {
      const { token, deployer, otherAccount } = await loadFixture(deployToken);
      await token.connect(deployer).transfer(otherAccount.address, 1000);
      await token.connect(otherAccount).approve(DEPLOYER_WALLET, 1000);
      await expect(token.connect(deployer).burnFrom(otherAccount.address, 1000)).to.changeTokenBalance(
        token,
        otherAccount.address,
        -1000
      );
    });
  });
  describe("Pause Functions", function () {
    it("pause()", async function () {
      const { token, deployer } = await loadFixture(deployToken);
      await token.pause();
      expect(await token.paused()).to.equal(true);
    });
    it("burnFrom()", async function () {
      const { token, deployer, otherAccount } = await loadFixture(deployToken);
      await token.pause();
      expect(await token.paused()).to.equal(true);
      await token.unpause();
      expect(await token.paused()).to.equal(false);
    });
  });
});
