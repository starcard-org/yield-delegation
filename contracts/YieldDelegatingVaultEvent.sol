// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

contract YieldDelegatingVaultEvent {
    /// @notice Emitted when a minter is added by admin
    event NewTreasury(address oldTreasury, address newTreasury);
    
    /// @notice Emitted when a minter is added by 
    event NewDelegatePercent(uint256 oldDelegatePercent, uint256 newDelegatePercent);

    /// @notice Emitted when a minter is added by admin
    event NewGlobalDepositCap(uint256 oldGlobalDepositCap, uint256 newGlobalDepositCap);
    
    /// @notice Emitted when a minter is added by admin
    event NewIndividualDepositCap(uint256 oldInvidivualDepositCap, uint256 newInvidivualDepositCap);
}
