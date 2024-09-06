import { expect } from "chai";
import hre from "hardhat";
import { ethers, run } from "hardhat";
import { Group, Identity, generateProof } from "@semaphore-protocol/core";

describe("SemaphoreWhistleblowing", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function loadFixture() {
    const { semaphore } = await run("deploy:semaphore", {
      logs: false,
    });
    const semaphoreContract = semaphore;
    const ImplementationContract = await hre.ethers.getContractFactory(
      "SemaphoreWhistleblowing"
    );
    const implementation = await ImplementationContract.deploy();
    const FactoryContract = await hre.ethers.getContractFactory(
      "WhistleblowingFactoryContract"
    );
    const factory = await FactoryContract.deploy(
      await implementation.getAddress(),
      await semaphore.getAddress()
    );
    const signers = await hre.ethers.getSigners();
    return { factory, signers, semaphoreContract };
  }
  describe("# WhistleblowingFactoryContract", () => {
    it("Should create more than one implementation", async () => {
      const { factory } = await loadFixture();
      await factory.createSemaphoreWhistleblowingProxy();
      await factory.createSemaphoreWhistleblowingProxy();
      await factory.createSemaphoreWhistleblowingProxy();
      const deployedClones = await factory.getAllSemaphoreWhistleblowing();
      expect(deployedClones.length).to.equal(3);
    });
    it("Should return address of deployed contract by index", async () => {
      const { factory } = await loadFixture();
      await factory.createSemaphoreWhistleblowingProxy();
      await factory.createSemaphoreWhistleblowingProxy();
      await factory.createSemaphoreWhistleblowingProxy();

      const deployedClone = await factory.getSemaphoreWhistleblowingById(1);
      expect(deployedClone).not.empty;
    });

    it("Should instance a specific clone contract", async () => {
      const { factory } = await loadFixture();
      await factory.createSemaphoreWhistleblowingProxy();
      await factory.createSemaphoreWhistleblowingProxy();
      await factory.createSemaphoreWhistleblowingProxy();

      const deployedClone = await factory.getSemaphoreWhistleblowingById(1);
      expect(deployedClone).not.empty;
      const instance = await hre.ethers.getContractAt(
        "SemaphoreWhistleblowing",
        deployedClone
      );
      expect(instance).to.exist;
    });
  });
  describe("# SemaphoreWhistleblowing", () => {
    it("Should create an entity", async () => {
      const { factory, signers } = await loadFixture();
      await factory.createSemaphoreWhistleblowingProxy();
      const deployedClone = await factory.getSemaphoreWhistleblowingById(0);
      const instance = await hre.ethers.getContractAt(
        "SemaphoreWhistleblowing",
        deployedClone
      );
      const coordinator = signers[0];
      const entityId = 0;
      const transaction = await instance.createEntity(coordinator.address);

      await expect(transaction)
        .to.emit(instance, "EntityCreated")
        .withArgs(entityId, coordinator.address);
    });
    it("Should add a whistleblower to an entity", async () => {
      const { factory, signers, semaphoreContract } = await loadFixture();
      await factory.createSemaphoreWhistleblowingProxy();
      const deployedClone = await factory.getSemaphoreWhistleblowingById(0);
      const instance = await hre.ethers.getContractAt(
        "SemaphoreWhistleblowing",
        deployedClone
      );

      const coordinator = signers[0];
      const entityId = 0;
      const identity = new Identity();
      await instance.createEntity(coordinator.getAddress());

      const transaction = await instance.addWhistleblower(
        entityId,
        identity.commitment
      );

      await expect(transaction).to.emit(semaphoreContract, "MemberAdded");
    });
    it("Should not add a whistleblower to an entity if the caller is not the editor", async () => {
      const { factory, signers } = await loadFixture();
      await factory.createSemaphoreWhistleblowingProxy();
      const deployedClone = await factory.getSemaphoreWhistleblowingById(0);
      const instance = await hre.ethers.getContractAt(
        "SemaphoreWhistleblowing",
        deployedClone
      );

      const coordinator = signers[0];
      const whistleblower = signers[1];
      const entityId = 0;
      const identity = new Identity();
      await instance.createEntity(coordinator.getAddress());

      const transaction = instance
        .connect(whistleblower) // the contract but different runner
        .addWhistleblower(entityId, identity.commitment);

      await expect(transaction).to.be.revertedWithCustomError(
        instance,
        "SemaphoreWhistleblowing__CallerIsNotTheEditor"
      );
    });

    it("Should add a whistleblower to an entity", async () => {
      const { factory, signers, semaphoreContract } = await loadFixture();
      await factory.createSemaphoreWhistleblowingProxy();
      const deployedClone = await factory.getSemaphoreWhistleblowingById(0);
      const instance = await hre.ethers.getContractAt(
        "SemaphoreWhistleblowing",
        deployedClone
      );

      const coordinator = signers[0];
      const entityId = 0;
      const identity = new Identity();
      await instance.createEntity(coordinator.getAddress());

      const transaction = await instance.addWhistleblower(
        entityId,
        identity.commitment
      );

      await expect(transaction).to.emit(semaphoreContract, "MemberAdded");
    });

    it("Should allow a whistleblower to publish a leak", async () => {
      const { factory, signers } = await loadFixture();
      await factory.createSemaphoreWhistleblowingProxy();
      await factory.createSemaphoreWhistleblowingProxy();
      await factory.createSemaphoreWhistleblowingProxy();
      const deployedClone = await factory.getSemaphoreWhistleblowingById(1);
      const instance = await hre.ethers.getContractAt(
        "SemaphoreWhistleblowing",
        deployedClone
      );

      const coordinator = signers[0];
      const entityId = 0;
      const identity = new Identity();
      const group = new Group();
      group.addMember(identity.commitment);
      const leak = ethers.keccak256(ethers.toUtf8Bytes("leak"));
      const proof = await generateProof(identity, group, leak, 0);
      await instance.createEntity(coordinator.address);
      await instance.addWhistleblower(entityId, identity.commitment);

      const transaction = await instance.publishLeak(
        leak,
        proof.nullifier,
        entityId,
        proof.merkleTreeDepth,
        proof.merkleTreeRoot,
        proof.points
      );

      await expect(transaction)
        .to.emit(instance, "LeakPublished")
        .withArgs(entityId, leak);
    });

    it("Should not allow a whistleblower to publish a leak with an invalid proof", async () => {
      const { factory, signers, semaphoreContract } = await loadFixture();
      await factory.createSemaphoreWhistleblowingProxy();
      await factory.createSemaphoreWhistleblowingProxy();
      await factory.createSemaphoreWhistleblowingProxy();
      const deployedClone = await factory.getSemaphoreWhistleblowingById(2);
      const instance = await hre.ethers.getContractAt(
        "SemaphoreWhistleblowing",
        deployedClone
      );

      const coordinator = signers[0];
      const entityId = 0;
      const identity = new Identity();
      const group = new Group();
      group.addMember(identity.commitment);
      const leak = ethers.keccak256(ethers.toUtf8Bytes("leak"));
      const proof = await generateProof(identity, group, leak, 0);
      await instance.createEntity(coordinator.address);
      await instance.addWhistleblower(entityId, identity.commitment);

      const invalidProof = proof.points;
      invalidProof[0] = "1234";

      const transaction = instance.publishLeak(
        leak,
        proof.nullifier,
        entityId,
        proof.merkleTreeDepth,
        proof.merkleTreeRoot,
        invalidProof
      );

      await expect(transaction).to.be.revertedWithCustomError(
        semaphoreContract,
        "Semaphore__InvalidProof"
      );
    });
  });
});
