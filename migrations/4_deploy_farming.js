const  RallyToken = artifacts.require("RallyToken");
const  NoMintLiquidityRewardPools = artifacts.require("NoMintLiquidityRewardPools");

module.exports = async (deployer, network, accounts) => {
  await Promise.all ([deployFarming(deployer, network, accounts)]);
}

async function deployFarming (deployer, network, accounts) {
  await deployer.deploy(RallyToken, accounts[0]);

  let block = await web3.eth.getBlock("latest");
  let perBlock = web3.utils.toBN(10**18).mul(web3.utils.toBN(1100)); //1100 RLY per block to start ~= 10MM / day

  await deployer.deploy(NoMintLiquidityRewardPools, RallyToken.address, perBlock, block.number);

  let rt = new web3.eth.Contract(RallyToken.abi, RallyToken.address);
  rt.methods.transfer(NoMintLiquidityRewardPools.address, web3.utils.toBN(10**18).mul(web3.utils.toBN(300)).mul(web3.utils.toBN(10**6)).toString()).send({from:accounts[0]}); //300MM RallyToken to the farming pools
}
