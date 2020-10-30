const YieldDelegatingVault2 = artifacts.require("YieldDelegatingVault2");
const YDVRewardsDistributor = artifacts.require("YDVRewardsDistributor");

module.exports = async function(deployer, network, accounts) {
  if (network == 'mainnet' || network == 'development' || network == 'mainnet-fork') {
    let treasury = process.env.TREASURY;

    let usdc_address = '0x597ad1e0c13bfe8025993d9e79c69e1c0233522e';

    let rewards = new web3.eth.Contract(YDVRewardsDistributor.abi, '0xFb467828778a6747011c467e1B346D08491Ae353');
    await deployer.deploy(
      YieldDelegatingVault2,
      usdc_address,
      rewards.options.address,
      treasury,
      "9000",
      "49669600511095000000000000000000"
    );

    console.log("registering with rewards distribution");
    await rewards.methods.addYDV(YieldDelegatingVault2.address).send({from:process.env.DEPLOYER_ACCOUNT});
  }
};



