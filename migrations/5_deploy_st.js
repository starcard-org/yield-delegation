const  SampleToken = artifacts.require("SampleToken");
const  SampleVault = artifacts.require("SampleVault");
const  RallyToken  = artifacts.require("RallyToken");
const  YDV         = artifacts.require("YieldDelegatingVault");
const YDVRewardsDistributor = artifacts.require("YDVRewardsDistributor");

module.exports = async (deployer, network, accounts) => {
  await Promise.all ([deploySampleVault(deployer, network, accounts)]);
}

async function deploySampleVault (deployer, network, accounts) {
  if (network == 'development') {
    let controller = process.env.CONTROLLER;
    let treasury = process.env.TREASURY;
    await deployer.deploy(SampleToken);

    let st = new web3.eth.Contract(SampleToken.abi, SampleToken.address);
  
    await deployer.deploy(SampleVault, st.options.address);

    let sv = new web3.eth.Contract(SampleVault.abi, SampleVault.address);

    await st.methods.addMinter(sv.options.address).send({from: accounts[0]}); //make sure our vault can mint sample tokens for testing
    await st.methods.mint(accounts[0], web3.utils.toBN(10**3).mul(web3.utils.toBN(10**18)).mul(web3.utils.toBN(250)).toString()).send({from: accounts[0]}); //load up some tokens in a test account


    let ydv = await deployer.deploy(
      YDV,
      sv.options.address,
      YDVRewardsDistributor.address,
      treasury,
      "9000", //out of 10000
      "100000000000000000000000000", //global deposit cap
      "100000000000000000000000" //per deposit cap
    );

    let rewards = new web3.eth.Contract(YDVRewardsDistributor.abi, YDVRewardsDistributor.address);
    rewards.methods.addYDV(ydv.address).send({from:accounts[0]});
  }
}
