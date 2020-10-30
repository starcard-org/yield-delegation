const YieldDelegatingVault2 = artifacts.require("YieldDelegatingVault2");
const YDVRewardsDistributor = artifacts.require("YDVRewardsDistributor");

module.exports = async function(deployer, network, accounts) {
  if (network == 'mainnet' || network == 'development' || network == 'mainnet-fork') {
    let treasury = process.env.TREASURY;

    let busd_address = '0x2994529C0652D127b7842094103715ec5299bBed';

    let rewards = new web3.eth.Contract(YDVRewardsDistributor.abi, '0xFb467828778a6747011c467e1B346D08491Ae353');
    await deployer.deploy(
      YieldDelegatingVault2,
      busd_address,
      rewards.options.address,
      treasury,
      "9000",
      "52461109490000000000"
    );

    console.log("registering with rewards distribution");
    await rewards.methods.addYDV(YieldDelegatingVault2.address).send({from:process.env.DEPLOYER_ACCOUNT});
  }
};



