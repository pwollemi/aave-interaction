const { ethers, upgrades } = require('hardhat');

const lendingPool = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9"; // mainnet

async function main() {
    const MyContractFactory = await ethers.getContractFactory("MyContract");
    const myContract = await upgrades.deployProxy(MyContractFactory, [lendingPool]);
    await myContract.deployed();
    console.log("MyContract:", myContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
  