// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./YDVRewardsDistributor.sol";

contract YieldDelegatingVaultStorage {
    address public controller;
    address public vault;
    YDVRewardsDistributor rewards;
    IERC20 public rally;
    address public treasury;
    IERC20 public token;
    uint256 public delegatePercent;
    uint256 public globalDepositCap;
    uint256 public individualDepositCap;
    
    mapping(address => uint256) public rewardDebt;
    uint256 public totalDeposits;

    uint256 public rewardPerToken;
    uint256 public accRallyPerShare;
}
