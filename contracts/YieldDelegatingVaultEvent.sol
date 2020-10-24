// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

contract YieldDelegatingVaultEvent {
    /// @notice Emitted when set new treasury
    event NewTreasury(address oldTreasury, address newTreasury);
    
    /// @notice Emitted when set new delegate percent
    event NewDelegatePercent(uint256 oldDelegatePercent, uint256 newDelegatePercent);

    /// @notice Emitted when set new global deposit cap
    event NewGlobalDepositCap(uint256 oldGlobalDepositCap, uint256 newGlobalDepositCap);
    
    /// @notice Emitted when set new individual deposit cap
    event NewIndividualDepositCap(uint256 oldInvidivualDepositCap, uint256 newInvidivualDepositCap);
    
    /// @notice Emitted when a minter is added by admin
    event NewRewardPerToken(uint256 oldRewardPerToken, uint256 newRewardPerToken);
    
    /// @notice Emitted when a YDV minted
    event Mint(address account, uint256 shares);

    /// @notice Emitted when a YDV burned
    event Burn(address account, uint256 shares);

    /// @notice Emitted when a Rally distributed to user
    event DistributeReward(address _to, uint256 rallyBal);

    /// @notice Emitted when a harvest
    event Harvest(address treasury, uint256 amount);

    /// @notice Emitted when reward tokens transferd from distributor to YDV
    event TransferReward(address to, uint256 amount);
    
    /// @notice Emitted when a reward paid
    event RewardPaid(address account, uint256 reward);
}
