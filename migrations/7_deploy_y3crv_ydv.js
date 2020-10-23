const YieldDelegatingVault2 = artifacts.require("YieldDelegatingVault2");
const YDVRewardsDistributor = artifacts.require("YDVRewardsDistributor");
const NoMintLiquidityRewardPools = artifacts.require("NoMintLiquidityRewardPools");

module.exports = async function(deployer, network, accounts) {
  if (network == 'mainnet' || network == 'development') {
    let treasury = process.env.TREASURY;

    let y3crv_address = '0x9cA85572E6A3EbF24dEDd195623F188735A5179f';

    let rewards = new web3.eth.Contract(YDVRewardsDistributor.abi, '0xFb467828778a6747011c467e1B346D08491Ae353');
    await deployer.deploy(
      YieldDelegatingVault2,
      y3crv_address,
      rewards.options.address,
      treasury,
      "9000",
      "52461109490000000000"
    );

    await rewards.methods.addYDV(YieldDelegatingVault2.address).send({from:process.env.DEPLOYER_ACCOUNT});

    let pools = new web3.eth.Contract(NoMintLiquidityRewardPools.abi, '0x9CF178df8DDb65B9ea7d4C2f5d1610eB82927230');
    await pools.methods.add(0, YieldDelegatingVault2.address, false).send({from:process.env.DEPLOYER_ACCOUNT}); //add to pool rewards
    
    let ydv = new web3.eth.Contract(YieldDelegatingVault2.abi, YieldDelegatingVault2.address);
    await ydv.methods.enableLiquidityRewards(pools.options.address, 5).send({from:accounts[0]});;
  }
};



