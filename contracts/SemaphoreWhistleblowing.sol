// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {ISemaphore} from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import {ISemaphoreWhistleblowing} from "@semaphore-extensions/contracts/interfaces/ISemaphoreWhistleblowing.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract SemaphoreWhistleblowing is ISemaphoreWhistleblowing, Initializable {
    ISemaphore public semaphore;

    mapping(uint256 => address) private entities;

    modifier onlyEditor(uint256 entityId) {
        if (entities[entityId] != msg.sender) {
            revert SemaphoreWhistleblowing__CallerIsNotTheEditor();
        }

        _;
    }

    // constructor(ISemaphore _semaphore) {
    //     semaphore = _semaphore;
    // }

    function initialize(address semaphoreAddress) public initializer {
        semaphore = ISemaphore(semaphoreAddress);
    }

    function createEntity(address editor) external override {
        uint256 groupId = semaphore.createGroup();
        entities[groupId] = editor;
        emit EntityCreated(groupId, editor);
    }

    function addWhistleblower(uint256 entityId, uint256 identityCommitment) external override onlyEditor(entityId) {
        semaphore.addMember(entityId, identityCommitment);
    }

    function removeWhistleblower(
        uint256 entityId,
        uint256 identityCommitment,
        uint256[] calldata proofSiblings
    ) external override onlyEditor(entityId) {
        semaphore.removeMember(entityId, identityCommitment, proofSiblings);
    }

    function publishLeak(
        uint256 leak,
        uint256 nullifier,
        uint256 entityId,
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256[8] calldata proof
    ) external override {
        ISemaphore.SemaphoreProof memory semaphoreProof = ISemaphore.SemaphoreProof({
            merkleTreeDepth: merkleTreeDepth,
            merkleTreeRoot: merkleTreeRoot,
            nullifier: nullifier,
            message: leak,
            scope: entityId,
            points: proof
        });

        semaphore.validateProof(entityId, semaphoreProof);

        emit LeakPublished(entityId, leak);
    }
}
