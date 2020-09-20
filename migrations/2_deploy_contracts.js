const YieldDelegatingVault = artifacts.require("YieldDelegatingVault");
const SampleToken = artifacts.require("SampleToken");

module.exports = async function(deployer) {  
  await deployer.deploy(YieldDelegatingVault, "0x597ad1e0c13bfe8025993d9e79c69e1c0233522e"); //proxy into yearn USDC vault
  await deployer.deploy(SampleToken, "10000000000000000");
};
