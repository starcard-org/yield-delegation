// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../farming/NoMintLiquidityRewardPools.sol"; 
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract RallySnapshotScore {
  using Address for address;
  using SafeMath for uint256;

  address public constant baseToken = address(0xf1f955016EcbCd7321c7266BccFB96c68ea5E49b);
  NoMintLiquidityRewardPools public constant stakingPools = NoMintLiquidityRewardPools(address(0x9CF178df8DDb65B9ea7d4C2f5d1610eB82927230));
  
  function snapshotScore(address account) public view returns (uint256) {
    uint256 score = IERC20(baseToken).balanceOf(account);


    for (uint i = 0; i < stakingPools.poolLength(); i++) {
      (IERC20 lpToken,,,) = stakingPools.poolInfo(i);
      uint256 baseTokenInPool = IERC20(baseToken).balanceOf(address(lpToken));
      if (baseTokenInPool > 0) {
        (uint256 stakedPoolTokens, ) = stakingPools.userInfo(i, account);
        uint256 userPoolTokens = stakedPoolTokens.add(lpToken.balanceOf(account));
        score = score.add(userPoolTokens.mul(baseTokenInPool).div(lpToken.totalSupply()));
      }
    }
    return score;
  }
}
