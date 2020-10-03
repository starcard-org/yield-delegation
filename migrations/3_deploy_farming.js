const  RallyToken = artifacts.require("RallyToken");
const  NoMintLiquidityRewardPools = artifacts.require("NoMintLiquidityRewardPools");

module.exports = async (deployer, network, accounts) => {
  await Promise.all ([deployFarming(deployer, network, accounts)]);
}

async function deployFarming (deployer, network, accounts) {

  let block = process.env.LM_START_BLOCK;
  let perBlock = web3.utils.toBN(10**18).mul(web3.utils.toBN(38)); //38 RLY per block to start ~= 243K RLY / day ~= 7.3MM RLY / month

  await deployer.deploy(NoMintLiquidityRewardPools, RallyToken.address, perBlock, block);
}
