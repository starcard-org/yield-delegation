const YieldDelegatingVault2 = artifacts.require("YieldDelegatingVault2");
const YDVRewardsDistributor = artifacts.require("YDVRewardsDistributor");

module.exports = async function(deployer, network, accounts) {
  if (network == 'mainnet' || network == 'development' || network == 'mainnet-fork') {
    let treasury = process.env.TREASURY;

    let yfi_address = '0xBA2E7Fed597fd0E3e70f5130BcDbbFE06bB94fe1';

    let rewards = new web3.eth.Contract(YDVRewardsDistributor.abi, '0xFb467828778a6747011c467e1B346D08491Ae353');
    await deployer.deploy(
      YieldDelegatingVault2,
      yfi_address,
      rewards.options.address,
      treasury,
      "9000",
      "803871029400000000000000"
    );

    console.log("registering with rewards distribution");
    await rewards.methods.addYDV(YieldDelegatingVault2.address).send({from:process.env.DEPLOYER_ACCOUNT});
  }
};



