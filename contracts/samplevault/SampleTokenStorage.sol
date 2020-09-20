// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

contract SampleTokenStorage {
    /**
     * @dev Initialized flag of reward token
     */
    bool internal initialized;

    /**
     * @notice Soft cap value of the reward token
     */
    uint256 public softCap;
}
