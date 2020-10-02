// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ControllerInterface {
    function payReward(address, uint256) external;
    function setYDV(address, address) external;
}
