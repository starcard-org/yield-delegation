// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

contract SampleTokenEvent {
    /// @notice Emitted when a minter is added by admin
    event MinterAdded(address account);

    /// @notice Emitted when soft cap is changed by admin
    event NewSoftCap(uint256 oldSoftCap, uint256 newSoftCap);
}
