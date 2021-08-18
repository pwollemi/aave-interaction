const { ethers, upgrades } = require("hardhat");
const { solidity } = require("ethereum-waffle");
const chai = require("chai");
const BN = require('bn.js');

chai.use(solidity);
chai.use(require('chai-bn')(BN));
const { expect } = chai;

const { impersonateForToken, approve, setNextBlockTimestamp } = require("./helper");

// assets
const usdc = {
  symbol: "USDC",
  address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  holder: "0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503",
  decimals: 6
};
const lendingPool = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9"; // mainnet

describe("Aave", function() {
  let myContract;
  let deployer;

  before(async function() {
    [deployer] = await ethers.getSigners();
    await impersonateForToken(usdc, deployer, "10000");
  });

  beforeEach(async function() {

    const MyContractFactory = await ethers.getContractFactory("MyContract");
    myContract = await upgrades.deployProxy(MyContractFactory, [lendingPool]);
    await myContract.deployed();

    await approve(usdc, deployer, myContract.address);
  });

  it("test", async function() {
    const depositValue = ethers.utils.parseUnits("1000", usdc.decimals);

    // deposit usdc
    await myContract.deposit(usdc.address, depositValue);

    // read collteral value
    const collateralInEth = await myContract.checkCollateralValueInEth();
    console.log("Collateral in Eth:", collateralInEth.toString());

    // withraw assets
    await myContract.withdraw(usdc.address, depositValue);
  });
});

