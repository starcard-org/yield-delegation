// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "../samplevault/SampleToken.sol";
import "../YDVErrorReporter.sol";

contract Controller is AccessControl, Ownable, YDVErrorReporter {
    using SafeERC20 for IERC20;
    using Address for address;
    using SafeMath for uint256;

    SampleToken public reward;

    mapping(address => address) public ydvs;
    
    constructor(address _reward) public {
        reward = SampleToken(_reward);
    }

    function earnReward(address user, uint256 amount) external {
        reward.mint(user, amount);
    }

    function setYDV(address _vault, address _ydv) external onlyOwner {
        require(ydvs[_vault] == address(0), "ydv");
        ydvs[_vault] = _ydv;
    }
}
