const YieldDelegatingVault = artifacts.require("YieldDelegatingVault");
const RallyToken = artifacts.require("RallyToken");
const YDVRewardsDistributor = artifacts.require("YDVRewardsDistributor");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(YDVRewardsDistributor, RallyToken.address);

  let controller = process.env.CONTROLLER;
  let treasury = process.env.TREASURY;
  let yusdc_address = "0x597ad1e0c13bfe8025993d9e79c69e1c0233522e"; //yearn usdc vault

  console.log("controller = " + controller);
  console.log("treasury = " + treasury);

  let ydv = await deployer.deploy(
    YieldDelegatingVault,
    controller,
    yusdc_address,
    YDVRewardsDistributor.address,
    treasury,
    "9000", //out of 10000
    "100000000000000", //global deposit cap
    "100000000000" //per deposit cap
  ); //proxy into yearn USDC vault

  let rewards = new web3.eth.Contract(YDVRewardsDistributor.abi, YDVRewardsDistributor.address);
  rewards.methods.addYDV(ydv.address).send({from:accounts[0]});
};
