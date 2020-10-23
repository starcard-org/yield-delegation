// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./YieldDelegatingVaultEvent2.sol";
import "./YDVRewardsDistributor.sol";
import "./interfaces/Vault.sol";
import "./YDVErrorReporter.sol";
import "./YieldDelegatingVaultStorage2.sol";

contract YieldDelegatingVault2 is ERC20, YieldDelegatingVaultStorage2, YieldDelegatingVaultEvent2, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using Address for address;
    using SafeMath for uint256;

    constructor (
        address _vault,
        address _rewards,
        address _treasury,
        uint256 _delegatePercent,
        uint256 _rewardPerToken
    ) public ERC20(
        string(abi.encodePacked("rally delegating ", ERC20(Vault(_vault).token()).name())),
        string(abi.encodePacked("rd", ERC20(Vault(_vault).token()).symbol()))
    ) {
        _setupDecimals(ERC20(Vault(_vault).token()).decimals());
        token = IERC20(Vault(_vault).token()); //token being deposited in the referenced vault
        vault = _vault; //address of the vault we're proxying
        rewards = YDVRewardsDistributor(_rewards);
        rally = rewards.rewardToken();
	treasury = _treasury;
        delegatePercent = _delegatePercent;
        rewardPerToken = _rewardPerToken;
	totalDeposits = 0;
        accRallyPerShare = 0;
        lrEnabled = false;
    }

    function setTreasury(address newTreasury) public onlyOwner {
        require(newTreasury != address(0), "treasure should be valid address");

        address oldTreasury = treasury;
        treasury = newTreasury;

        emit NewTreasury(oldTreasury, newTreasury);
    }

    function setNewRewardPerToken(uint256 newRewardPerToken) public onlyOwner {
        uint256 oldRewardPerToken = rewardPerToken;
        rewardPerToken = newRewardPerToken;

        emit NewRewardPerToken(oldRewardPerToken, newRewardPerToken);
    }

    function earned(address account) public view returns (uint256) {
        return balanceForRewardsCalc(account).mul(accRallyPerShare).div(1e12).sub(rewardDebt[account]);
    }

    function balance() public view returns (uint256) {
        return (IERC20(vault)).balanceOf(address(this)); //how many shares do we have in the vault we are delegating to
    }

    //for the purpose of rewards calculations, a user's balance is the total of what's in their wallet
    //and what they have deposited in the rewards pool (if it's active).
    //transfer restriction ensures accuracy of this sum
    function balanceForRewardsCalc(address account) internal view returns (uint256) {
        if (lrEnabled) {
          (uint256 amount, ) = lrPools.userInfo(pid, account);
          return balanceOf(account).add(amount); 
        }
        return balanceOf(account);
    }

    function depositAll() external {
        deposit(token.balanceOf(msg.sender));
    }

    function deposit(uint256 _amount) public nonReentrant {
        uint256 pending = earned(msg.sender);
        if (pending > 0) {
            safeRallyTransfer(msg.sender, pending);
        }
        uint256 _pool = balance();

        uint256 _before = token.balanceOf(address(this));
        token.safeTransferFrom(msg.sender, address(this), _amount);
        uint256 _after = token.balanceOf(address(this));
        _amount = _after.sub(_before);

        totalDeposits = totalDeposits.add(_amount);

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
        rewardDebt[msg.sender] = balanceForRewardsCalc(msg.sender).mul(accRallyPerShare).div(1e12);
    }

    function deposityToken(uint256 _yamount) public nonReentrant {
        uint256 pending = earned(msg.sender);
        if (pending > 0) {
            safeRallyTransfer(msg.sender, pending);
        }

        uint256 _before = IERC20(vault).balanceOf(address(this));
        IERC20(vault).safeTransferFrom(msg.sender, address(this), _yamount);
        uint256 _after = IERC20(vault).balanceOf(address(this));
        _yamount = _after.sub(_before);

        uint _underlyingAmount = _yamount.mul(Vault(vault).getPricePerFullShare()).div(1e18);
        totalDeposits = totalDeposits.add(_underlyingAmount);
		
        //translate vault shares into delegating vault shares
        uint256 shares = 0;
        if (totalSupply() == 0) {
            shares = _yamount;
        } else {
            shares = (_yamount.mul(totalSupply())).div(_before);
        }
        _mint(msg.sender, shares);
        rewardDebt[msg.sender] = balanceForRewardsCalc(msg.sender).mul(accRallyPerShare).div(1e12);
    }

    function withdrawAll() external {
        withdraw(balanceOf(msg.sender));
    }

    function withdraw(uint256 _shares) public nonReentrant {
        uint256 pending = earned(msg.sender);
        if (pending > 0) {
            safeRallyTransfer(msg.sender, pending);
        }

        uint256 r = (balance().mul(_shares)).div(totalSupply());
        _burn(msg.sender, _shares);
        safeReduceTotalDeposits(r.mul(Vault(vault).getPricePerFullShare()).div(1e18));

        rewardDebt[msg.sender] = balanceForRewardsCalc(msg.sender).mul(accRallyPerShare).div(1e12);
        
        uint256 _before = token.balanceOf(address(this));
        Vault(vault).withdraw(r);
        uint256 _after = token.balanceOf(address(this));

        uint256 toTransfer = _after.sub(_before);
        token.safeTransfer(msg.sender, toTransfer);
    }

    //in case of rounding errors converting between vault tokens and underlying value
    function safeReduceTotalDeposits(uint256 _amount) internal {
        if (_amount > totalDeposits) {
          totalDeposits = 0;
        } else {
          totalDeposits = totalDeposits.sub(_amount);
        }
    }

    function withdrawyToken(uint256 _shares) public nonReentrant {
        uint256 pending = earned(msg.sender);
        if (pending > 0) {
            safeRallyTransfer(msg.sender, pending);
        }
        uint256 r = (balance().mul(_shares)).div(totalSupply());
        _burn(msg.sender, _shares);
        rewardDebt[msg.sender] = balanceForRewardsCalc(msg.sender).mul(accRallyPerShare).div(1e12);
        uint256 _amount = r.mul(Vault(vault).getPricePerFullShare()).div(1e18);

        safeReduceTotalDeposits(_amount);

        IERC20(vault).safeTransfer(msg.sender, r);
    }

    // Safe RLY transfer function, just in case pool does not have enough RLY due to rounding error
    function safeRallyTransfer(address _to, uint256 _amount) internal {
        uint256 rallyBal = rally.balanceOf(address(this));
        if (_amount > rallyBal) {
            rally.transfer(_to, rallyBal);
        } else {
            rally.transfer(_to, _amount);
        }
    }

    //how much are our shares of the underlying vault worth relative to the deposit value? returns value denominated in vault tokens
    function availableYield() public view returns (uint256) {
        uint256 totalValue = balance().mul(Vault(vault).getPricePerFullShare()).div(1e18);
        if (totalValue > totalDeposits) {
            uint256 earnings = totalValue.sub(totalDeposits);
            return earnings.mul(1e18).div(Vault(vault).getPricePerFullShare());
        }
        return 0;
    }

    //transfer accumulated yield to treasury, update totalDeposits to ensure availableYield following
    //harvest is 0, and increase accumulated rally rewards
    //harvest fails if we're unable to fund rewards
    function harvest() public onlyOwner {
        uint256 _availableYield = availableYield();
        if (_availableYield > 0) {
            uint256 rallyReward = _availableYield.mul(delegatePercent).div(10000).mul(rewardPerToken).div(1e18);
            rewards.transferReward(rallyReward);
            IERC20(vault).safeTransfer(treasury, _availableYield.mul(delegatePercent).div(10000));
            accRallyPerShare = accRallyPerShare.add(rallyReward.mul(1e12).div(totalSupply()));
            totalDeposits = balance().mul(Vault(vault).getPricePerFullShare()).div(1e18);
        }
    }

    //one way ticket and only callable once
    function enableLiquidityRewards(address _lrPools, uint256 _pid) public onlyOwner {
      (IERC20 lpToken,,,) =  NoMintLiquidityRewardPools(_lrPools).poolInfo(_pid);
      require(address(lpToken) == address(this), "invalid liquidity rewards setup");
      require(lrEnabled == false, "liquidity rewards already enabled");
      lrEnabled = true;
      lrPools = NoMintLiquidityRewardPools(_lrPools);
      pid = _pid;
    }

    //override underlying _transfer implementation; YDV shares can only be transferred to/from the liquidity rewards pool
    function _transfer(address sender, address recipient, uint256 amount) internal override {
      require(lrEnabled, "transfer rejected");
      require(sender == address(lrPools) || recipient == address(lrPools), "transfer rejected");
      super._transfer(sender, recipient, amount);
    }
}
