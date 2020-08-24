const  YieldDelegatingVault = artifacts.require("YieldDelegatingVault");

module.exports = function(deployer) {
  deployer.deploy(YieldDelegatingVault, "0x597aD1e0c13Bfe8025993D9e79C69E1c0233522e"); //proxy into yearn USDC vault
};
