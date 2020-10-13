const  RallyToken = artifacts.require("RallyToken");
const  NoMintLiquidityRewardPools = artifacts.require("NoMintLiquidityRewardPools");

module.exports = async (deployer, network, accounts) => {
  await Promise.all ([deployFarming(deployer, network, accounts)]);
}

async function deployFarming (deployer, network, accounts) {

  let block = process.env.LM_START_BLOCK;
  let perBlock = web3.utils.toBN(10**18).mul(web3.utils.toBN(38)); //38 RLY per block to start ~= 243K RLY / day ~= 7.3MM RLY / month

  await deployer.deploy(NoMintLiquidityRewardPools, RallyToken.address, perBlock, block);
  if (network == 'development') {
    let rewards = new web3.eth.Contract(NoMintLiquidityRewardPools.abi, NoMintLiquidityRewardPools.address);

    await rewards.methods.add(1000, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', false).send({from: accounts[0]}); 
  }
}
