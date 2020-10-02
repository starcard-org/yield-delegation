// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ControllerInterface.sol";

contract YieldDelegatingVaultStorage {
    ControllerInterface public controller;
    address public vault;
    IERC20 public rally;
    address public treasury;
    IERC20 public token;
    uint256 public delegatePercent;
    uint256 public globalDepositCap;
    uint256 public individualDepositCap;
    
    mapping(address => uint256) public userDeposits;
    uint256 public totalDeposits;

    uint256 public rewardPerToken;
    mapping(address => uint256) public rewards;
}
