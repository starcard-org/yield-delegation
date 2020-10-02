// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/GSN/Context.sol";

import "./YieldDelegatingVaultStorage.sol";
import "./YieldDelegatingVaultEvent.sol";
import "./interfaces/ControllerInterface.sol";
import "./interfaces/Vault.sol";
import "./YDVErrorReporter.sol";

contract YieldDelegatingVault is ERC20, YieldDelegatingVaultStorage, YieldDelegatingVaultEvent, YDVErrorReporter, AccessControl, Ownable {
    using SafeERC20 for IERC20;
    using Address for address;
    using SafeMath for uint256;

    bytes32 public constant CONTROLLER_ROLE = keccak256("CONTROLLER");

    constructor (
        ControllerInterface _controller,
        address _vault,
        IERC20 _rally,
        address _treasury,
        uint256 _delegatePercent,
        uint256 _globalDepositCap,
        uint256 _individualDepositCap
    ) public ERC20(
        string(abi.encodePacked("rally delegating ", ERC20(Vault(_vault).token()).name())),
        string(abi.encodePacked("rd", ERC20(Vault(_vault).token()).symbol()))
    ) {
        _setupDecimals(ERC20(Vault(_vault).token()).decimals());
        token = IERC20(Vault(_vault).token()); //token being deposited in the referenced vault
        vault = _vault; //address of the vault we're proxying
        rally = _rally;
	    treasury = _treasury;
        controller = _controller;
        delegatePercent = _delegatePercent;
        globalDepositCap = _globalDepositCap;
        individualDepositCap = _individualDepositCap;
	    totalDeposits = 0;

        _setupRole(DEFAULT_ADMIN_ROLE, owner());
	    _setRoleAdmin(CONTROLLER_ROLE, DEFAULT_ADMIN_ROLE);
        grantRole(CONTROLLER_ROLE, address(controller));
    }

    function setTreasury(address newTreasury) public {
        require(hasRole(CONTROLLER_ROLE, msg.sender), "only controller can set treasury");
        require(newTreasury != address(0), "treasure should be valid address");

        address oldTreasury = treasury;
        treasury = newTreasury;

        emit NewTreasury(oldTreasury, newTreasury);
    }

    function setDelegatePercent(uint256 newDelegatePercent) public {
        require(hasRole(CONTROLLER_ROLE, msg.sender), "only controller can set delegate percent");
        require(newDelegatePercent <= 10000, "delegate percent should be lower than 100%");

        uint256 oldDelegatePercent = delegatePercent;
        delegatePercent = newDelegatePercent;

        emit NewDelegatePercent(oldDelegatePercent, newDelegatePercent);
    }

    function setGlobalDepositCap(uint256 newGlobalDepositCap) public {
        require(hasRole(CONTROLLER_ROLE, msg.sender), "only controller can set global deposit cap");
        require(newGlobalDepositCap >= totalDeposits, "global deposit cap should be bigger than totalDeposits");

        uint256 oldGlobalDepositCap = globalDepositCap;
        globalDepositCap = newGlobalDepositCap;

        emit NewGlobalDepositCap(oldGlobalDepositCap, newGlobalDepositCap);
    }

    function setIndividualDepositCap(uint256 newIndividualDepositCap) public {
        require(hasRole(CONTROLLER_ROLE, msg.sender), "only controller can set individual deposit cap");

        uint256 oldIndividualDepositCap = individualDepositCap;
        individualDepositCap = newIndividualDepositCap;

        emit NewIndividualDepositCap(oldIndividualDepositCap, newIndividualDepositCap);
    }

    function setNewRewardPerToken(uint256 newRewardPerToken) public {
        require(hasRole(CONTROLLER_ROLE, msg.sender), "only controller can set reward per token");

        uint256 oldRewardPerToken = rewardPerToken;
        rewardPerToken = newRewardPerToken;

        emit NewRewardPerToken(oldRewardPerToken, newRewardPerToken);
    }

    modifier updateReward(address account) {
        if (account != address(0)) {
            rewards[account] = earned(account);
        }
        _;
    }

    function earned(address account) public view returns (uint256) {
        uint256 _availableYield = availableYield(account);
        return
            _availableYield
                .mul(rewardPerToken)
                .div(1e18);
    }

    function balance() public view returns (uint256) {
        return (IERC20(vault)).balanceOf(address(this)); //how many shares do we have in the vault we are delegating to
    }

    function depositAll() external {
        deposit(token.balanceOf(msg.sender));
    }

    function deposit(uint256 _amount) public updateReward(msg.sender) returns (uint256) {
        if(individualDepositCap < balanceOf(address(this)).add(_amount)) {
            return fail(Error.BAD_INPUT, FailureInfo.SET_INDIVIDUAL_SOFT_CAP_CHECK);
        }

        if(globalDepositCap < totalSupply().add(_amount)) {
            return fail(Error.BAD_INPUT, FailureInfo.SET_GLOBAL_SOFT_CAP_CHECK);
        }
        uint256 _pool = balance();

        uint256 _before = token.balanceOf(address(this));
        token.safeTransferFrom(msg.sender, address(this), _amount);
        uint256 _after = token.balanceOf(address(this));
        _amount = _after.sub(_before);

        totalDeposits = totalDeposits.add(_amount);
        userDeposits[msg.sender] = userDeposits[msg.sender].add(_amount);

        token.approve(vault, _amount);
        Vault(vault).deposit(_amount);
        uint256 _after_pool = balance();
		
        uint256 _new_shares = _after_pool.sub(_pool); //new vault tokens representing my added vault shares

        //translate vault shares into delegating vault shares
        uint256 shares = 0;
        if (totalSupply() == 0) {
            shares = _new_shares;
        } else {
            shares = (_new_shares.mul(totalSupply())).div(_pool);
        }
        _mint(msg.sender, shares);
    }

    function deposityToken(uint256 _yamount) public returns (uint256) {
        uint256 _pool = balance();

        uint256 _before = IERC20(vault).balanceOf(address(this));
        IERC20(vault).safeTransferFrom(msg.sender, address(this), _yamount);
        uint256 _after = IERC20(vault).balanceOf(address(this));
        _yamount = _after.sub(_before);

        uint _underlyingAmount = _yamount.div(Vault(vault).getPricePerFullShare());
        totalDeposits = totalDeposits.add(_underlyingAmount);
        userDeposits[msg.sender] = userDeposits[msg.sender].add(_underlyingAmount);
		
        //translate vault shares into delegating vault shares
        uint256 shares = 0;
        if (totalSupply() == 0) {
            shares = _yamount;
        } else {
            shares = (_yamount.mul(totalSupply())).div(_pool);
        }
        _mint(msg.sender, shares);
    }

    function withdrawAll() external updateReward(msg.sender) {
        withdraw(balanceOf(msg.sender));
    }

    function withdraw(uint256 _shares) public updateReward(msg.sender) {
        uint256 r = (balance().mul(_shares)).div(totalSupply());
        _burn(msg.sender, _shares);

        uint256 _before = token.balanceOf(address(this));
        Vault(vault).withdraw(r);
        uint256 _after = token.balanceOf(address(this));

        totalDeposits = totalDeposits.add(_after).sub(_before);
        userDeposits[msg.sender] = userDeposits[msg.sender].add(_after).sub(_before);

        token.safeTransfer(msg.sender, _after.sub(_before));
    }

    function withdrawyToken(uint256 _shares) public {
        uint256 r = (balance().mul(_shares)).div(totalSupply());
        _burn(msg.sender, _shares);

        uint256 _amount = r.div(Vault(vault).getPricePerFullShare());

        totalDeposits = totalDeposits.sub(_amount);
        userDeposits[msg.sender] = userDeposits[msg.sender].sub(_amount);

        IERC20(vault).safeTransfer(msg.sender, r);
    }

    //differs from underlying vault implementation, price per full share denominated in token type we are depositing into the underlying vault
    function getPricePerFullShare() public view returns (uint256) {
    	return (Vault(vault).getPricePerFullShare().mul(balance())).div(totalSupply());
    }

    //how much are user's shares of the underlying vault worth relative to the deposit value? that's the user's avaialable yield
    function availableYield(address _account) public view returns (uint256) {
        uint256 userValue = userDeposits[_account].mul(Vault(vault).getPricePerFullShare()).div(1e18);
        if (userValue > userDeposits[_account]) {
            return userValue.sub(userDeposits[_account]);
        }
        return 0;
    }

    //how much are our shares of the underlying vault worth relative to the deposit value? that's the avaialable yield
    function availableYield() public view returns (uint256) {
        uint256 totalValue = balance().mul(Vault(vault).getPricePerFullShare()).div(1e18);
        if (totalValue > totalDeposits) {
            return totalValue.sub(totalDeposits);
        }
        return 0;
    }

    function harvest() external updateReward(msg.sender) {
        uint256 _availableYield = availableYield();
        if (_availableYield > 0) {
            uint256 _before = token.balanceOf(address(this));
            Vault(vault).withdraw(_availableYield.mul(1e18).div(Vault(vault).getPricePerFullShare()).mul(delegatePercent).div(10000)); //translate yield to shares in underlying vault, haircut to 90% to allow for fees etc...
            uint256 _after = token.balanceOf(address(this));
            token.safeTransfer(treasury, _after.sub(_before));
        }
    }

    function getReward() public updateReward(msg.sender) {
        uint256 reward = earned(msg.sender);
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rally.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }
}
