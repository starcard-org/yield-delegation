// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/GSN/Context.sol";

import"./SampleToken.sol";

contract SampleVault is ERC20 {
    using SafeERC20 for IERC20;
    using Address for address;
    using SafeMath for uint256;

    address public token;

    constructor (address _token) public ERC20(
        string(abi.encodePacked("sample vault ", ERC20(_token).name())),
        string(abi.encodePacked("sv", ERC20(_token).symbol()))
    ) {
        _setupDecimals(ERC20(_token).decimals());
        token = _token;
    }

    function balance() public view returns (uint) {
        return IERC20(token).balanceOf(address(this));
    }

    function depositAll() external {
        deposit(IERC20(token).balanceOf(msg.sender));
    }

    function deposit(uint _amount) public {
        uint _pool = balance();
        IERC20(token).safeTransferFrom(msg.sender, address(this), _amount);
        uint _after = IERC20(token).balanceOf(address(this));
        _amount = _after.sub(_pool); // Additional check for deflationary tokens

        //translate vault shares into delegating vault shares
        uint shares = 0;
        if (totalSupply() == 0) {
            shares = _amount;
        } else {
            shares = (_amount.mul(totalSupply())).div(_pool);
        }
        _mint(msg.sender, shares);
    }

    function withdrawAll() external {
        withdraw(balanceOf(msg.sender));
    }

    function withdraw(uint _shares) public {
        uint r = (balance().mul(_shares)).div(totalSupply());
        _burn(msg.sender, _shares);

        IERC20(token).safeTransfer(msg.sender, r);
    }

    function getPricePerFullShare() public view returns (uint) {
    	return balance().mul(1e18).div(totalSupply());
    }

    //add 10% more tokens to simulate generating yield
    function simulateEarnings() public {
        SampleToken(token).mint(address(this), balance().mul(1000).div(10000));
    }
}
