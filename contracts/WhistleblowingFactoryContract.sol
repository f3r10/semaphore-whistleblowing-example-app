// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "./SemaphoreWhistleblowing.sol";

contract WhistleblowingFactoryContract {
    //this variable hold the concrate implementation
    address public implementation;

    // an array that contains all the instances of SemaphoreWhistleblowing.sol contract 
    address[] public semaphoreWhistleblowingProxies;

    using Clones for address;
    ISemaphore public semaphore;

    //the constructor of the factory receives the instance of the children contract
    constructor(address _implementation, address semaphoreAddress) {
        semaphore = ISemaphore(semaphoreAddress);
        implementation = _implementation;
    }

    //this method creates the instances of the children contract
    function SemaphoreWhistleblowingProxy() external payable returns (address semaphoreWhistleblowingProxyContract) {
        
        semaphoreWhistleblowingProxyContract = Clones.clone(implementation);
        SemaphoreWhistleblowing(semaphoreWhistleblowingProxyContract).initialize(
	    address(semaphore)
        );

        semaphoreWhistleblowingProxies.push(semaphoreWhistleblowingProxyContract);
        emit SemaphoreWhistleblowingCloneCreated(
            semaphoreWhistleblowingProxyContract,
            semaphoreWhistleblowingProxies.length,
            semaphoreWhistleblowingProxies
        );
    }

    function getAllSemaphoreWhistleblowing() public view returns (address[] memory) {
        return semaphoreWhistleblowingProxies;
    }

    function getSemaphoreWhistleblowingById(uint8 id) public view returns (address) {
        return semaphoreWhistleblowingProxies[id];
    }

    event SemaphoreWhistleblowingCloneCreated(
        address semaphoreWhistleblowingContract,
        uint256 numSemaphoreWhistleblowing,
        address[] semaphoreWhistleblowingProxies
    );
}
