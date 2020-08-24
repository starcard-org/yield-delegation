// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract SampleToken is ERC20, AccessControl {
    using Address for address;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER");

    constructor () public ERC20(
        string(abi.encodePacked("sample token")),
        string(abi.encodePacked("STKN"))
    ) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
	_setRoleAdmin(MINTER_ROLE, DEFAULT_ADMIN_ROLE);
	addMinter(msg.sender);
    }

    function addMinter(address account) public {
      grantRole(MINTER_ROLE, account);
    }

    function mint (address account, uint amount) public {
      require (hasRole(MINTER_ROLE, msg.sender), "only minters");
      _mint(account, amount);
    }
    
}
