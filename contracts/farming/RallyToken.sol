// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RallyToken is ERC20 {

    //15 billion fixed token supply with default 18 decimals
    uint256 public constant TOKEN_SUPPLY = 15 * 10**9 * 10**18;

    constructor (
        address _escrow
    ) public ERC20(
	"Rally Network Token",
	"RLY"
    ) {
        _mint(_escrow, TOKEN_SUPPLY);	
    }
}
