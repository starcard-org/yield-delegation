// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/GSN/Context.sol";

import "./interfaces/Controller.sol";
import "./interfaces/Vault.sol";

contract YieldDelegatingVault is ERC20 {
    using SafeERC20 for IERC20;
    using Address for address;
    using SafeMath for uint256;

    address public vault;
    address public treasury;
    IERC20 public token;
    
    uint public totalDeposits;

    constructor (address _vault) public ERC20(
        string(abi.encodePacked("rally delegating ", ERC20(_vault).name())),
        string(abi.encodePacked("rd", ERC20(_vault).symbol()))
    ) {
        _setupDecimals(ERC20(_vault).decimals());
        token = IERC20(Vault(_vault).token()); //token being deposited in the referenced vault
        vault = _vault; //address of the vault we're proxying
	totalDeposits = 0;
	treasury = msg.sender;
    }

    function balance() public view returns (uint) {
        return (IERC20(vault)).balanceOf(address(this)); //how many shares do we have in the vault we are delegating to
    }

    function depositAll() external {
        deposit(token.balanceOf(msg.sender));
    }

    function deposit(uint _amount) public {
        uint _pool = balance(); //how many vault shares do we have?

        uint _before = token.balanceOf(address(this));
        token.safeTransferFrom(msg.sender, address(this), _amount);
        uint _after = token.balanceOf(address(this));
        _amount = _after.sub(_before); // Additional check for deflationary tokens

        totalDeposits = totalDeposits.add(_amount);

        token.approve(vault, _amount);
        Vault(vault).deposit(_amount); // deposit funds into vault
        uint _after_pool = balance(); // deposit awarded me more vault tokens
		
        uint _new_shares = _after_pool.sub(_pool); //new vault tokens representing my added vault shares

        //translate vault shares into delegating vault shares
        uint shares = 0;
        if (totalSupply() == 0) {
            shares = _new_shares;
        } else {
            shares = (_new_shares.mul(totalSupply())).div(_pool);
        }
        _mint(msg.sender, shares);
    }

    function withdrawAll() external {
        withdraw(balanceOf(msg.sender));
    }

    function withdraw(uint _shares) public {
        uint r = (balance().mul(_shares)).div(totalSupply());
        _burn(msg.sender, _shares);

        uint _before = token.balanceOf(address(this));
        Vault(vault).withdraw(r);
        uint _after = token.balanceOf(address(this));

        totalDeposits = totalDeposits.add(_after).sub(_before);

        token.safeTransfer(msg.sender, _after.sub(_before));
    }

    //differs from underlying vault implementation, price per full share denominated in token type we are depositing into the underlying vault
    function getPricePerFullShare() public view returns (uint) {
    	return (Vault(vault).getPricePerFullShare().mul(balance())).div(totalSupply());
    }

    //how much are our shares of the underlying vault worth relative to the deposit value? that's the avaialable yield
    function availableYield() public view returns (uint) {
        uint totalValue = balance().mul(Vault(vault).getPricePerFullShare()).div(1e18);
        if (totalValue > totalDeposits) {
            return totalValue.sub(totalDeposits);
        }
        return 0;
    }

    function harvest() external {
        uint _availableYield = availableYield();
        if (_availableYield > 0) {
            uint _before = token.balanceOf(address(this));
                Vault(vault).withdraw(_availableYield.mul(1e18).div(Vault(vault).getPricePerFullShare()).mul(9).div(10)); //translate yield to shares in underlying vault, haircut to 90% to allow for fees etc...
            uint _after = token.balanceOf(address(this));
            token.safeTransfer(treasury, _after.sub(_before));
        }
    }
}
