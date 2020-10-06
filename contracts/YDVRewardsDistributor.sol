// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YDVRewardsDistributor is AccessControl, Ownable {
    using SafeERC20 for IERC20;
    using Address for address;

    IERC20 public rewardToken;
    address[] public ydvs;
    bytes32 public constant YDV_REWARDS = keccak256("YDV_REWARDS");
    
    constructor(address _rally) public {
        rewardToken = IERC20(_rally);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function transferReward(uint256 _amount) external {
        require (hasRole(YDV_REWARDS, msg.sender), "only ydv rewards");
        rewardToken.safeTransfer(msg.sender, _amount);
    }

    function addYDV(address _ydv) external onlyOwner {
        grantRole(YDV_REWARDS, _ydv);
        ydvs.push(_ydv);
    }

    function ydvsLength() external view returns (uint256) {
        return ydvs.length;
    }
}
