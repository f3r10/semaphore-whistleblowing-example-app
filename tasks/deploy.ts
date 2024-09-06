import { task, types } from "hardhat/config";

task("deploy", "Deploy contracts")
  .addOptionalParam(
    "semaphore",
    "Semaphore contract address",
    undefined,
    types.string
  )
  .addOptionalParam("logs", "Print the logs", true, types.boolean)
  .setAction(async ({ logs, semaphore: semaphoreAddress }, { ethers, run }) => {
    if (!semaphoreAddress) {
      const { semaphore } = await run("deploy:semaphore", {
        logs,
      });

      semaphoreAddress = await semaphore.getAddress();
    }

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
      [semaphoreWhistleblowingContract.target, semaphoreAddress]
    );
    await contractFactory.waitForDeployment();
    console.log(
      "contractFactory Contract deployed to:",
      contractFactory.target
    );
    return contractFactory;
  });
