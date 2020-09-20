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
     * @param softCap_ The initial soft cap of reward token
     */
    constructor (uint256 softCap_) public ERC20(
        string(abi.encodePacked("sample token")),
        string(abi.encodePacked("STKN"))
    ) {
        softCap = softCap_;

        _setupRole(DEFAULT_ADMIN_ROLE, owner());
	    _setRoleAdmin(MINTER_ROLE, DEFAULT_ADMIN_ROLE);
	    addMinter(owner());
    }

    /**
     * @notice Add the minter of the reward token
     * @param account_ The address of the minter
     */
    function addMinter(address account_) public onlyOwner {
        grantRole(MINTER_ROLE, account_);

        emit MinterAdded(account_);
    }

    /**
     * @notice Set the new soft cap of the reward token
     * @param newSoftCap The soft cap value
     */
    function setSoftCap(uint256 newSoftCap) public onlyOwner returns (uint) {
        if (newSoftCap < totalSupply()) {
            return fail(Error.BAD_INPUT, FailureInfo.SET_SOFT_CAP_CHECK);
        }

        uint256 oldSoftCap = softCap;
        softCap = newSoftCap;

        emit NewSoftCap(oldSoftCap, newSoftCap);
    }

    function mint (address account_, uint amount_) public returns (uint) {
        require (hasRole(MINTER_ROLE, msg.sender), "only minters");

        if (totalSupply() + amount_ > softCap) {
            return fail(Error.REJECTION, FailureInfo.SET_SOFT_CAP_CHECK);
        }

        _mint(account_, amount_);
    }
}
