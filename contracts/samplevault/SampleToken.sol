// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./SampleTokenStorage.sol";
import "./SampleTokenEvent.sol";
import "../YDVErrorReporter.sol";

contract SampleToken is ERC20, AccessControl, Ownable, SampleTokenStorage, SampleTokenEvent, YDVErrorReporter {
    using Address for address;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER");

    /**
     * @notice Constructs a reward token
     */
    constructor () public ERC20(
        string(abi.encodePacked("sample token")),
        string(abi.encodePacked("STKN"))
    ) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @notice Add the minter of the reward token
     * @param account_ The address of the minter
     */
    function addMinter(address account_) public {
        grantRole(MINTER_ROLE, account_);
        emit MinterAdded(account_);
    }

    function mint(address user, uint amount_) public returns (uint) {
        require (hasRole(MINTER_ROLE, msg.sender), "only minters");

        _mint(user, amount_);
    }
}
