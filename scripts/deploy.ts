import { ethers } from "hardhat";

async function main() {
  const semaphoreAddres =
    "0x1e0d7FF1610e480fC93BdEC510811ea2Ba6d7c2f" as `0x${string}`;

  const semaphoreWhistleblowingContract = await ethers.deployContract(
    "SemaphoreWhistleblowing",
    []
  );
  await semaphoreWhistleblowingContract.waitForDeployment();
  console.log(
    "semaphoreWhistleblowing contract deployed to:",
    semaphoreWhistleblowingContract.target
  );

  const contractFactory = await ethers.deployContract(
    "WhistleblowingFactoryContract",
    [semaphoreWhistleblowingContract.target, semaphoreAddres]
  );
  await contractFactory.waitForDeployment();
  console.log("contractFactory Contract deployed to:", contractFactory.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
