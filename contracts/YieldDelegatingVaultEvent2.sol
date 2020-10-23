// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

contract YieldDelegatingVaultEvent2 {
    /// @notice Emitted when set new treasury
    event NewTreasury(address oldTreasury, address newTreasury);
    
    /// @notice Emitted when set new delegate percent
    event NewDelegatePercent(uint256 oldDelegatePercent, uint256 newDelegatePercent);
    
    /// @notice Emitted when a minter is added by admin
    event NewRewardPerToken(uint256 oldRewardPerToken, uint256 newRewardPerToken);
}
