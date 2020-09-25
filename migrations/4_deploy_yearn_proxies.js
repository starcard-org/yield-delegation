const  YieldDelegatingVault = artifacts.require("YieldDelegatingVault");

module.exports = async (deployer, network, accounts) => {
  await Promise.all ([deploySampleVault(deployer, network, accounts)]);
}

async function deploySampleVault (deployer, network, accounts) {
  //USDC
  await deployer.deploy(YieldDelegatingVault, '0x597aD1e0c13Bfe8025993D9e79C69E1c0233522e');

  //yCRV
  await deployer.deploy(YieldDelegatingVault, '0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c');

  //TUSD
  await deployer.deploy(YieldDelegatingVault, '0x37d19d1c4E1fa9DC47bD1eA12f742a0887eDa74a');

  //DAI
  await deployer.deploy(YieldDelegatingVault, '0xACd43E627e64355f1861cEC6d3a6688B31a6F952');
  
  //USDT
  await deployer.deploy(YieldDelegatingVault, '0x2f08119C6f07c006695E079AAFc638b8789FAf18');

  //YFI
  await deployer.deploy(YieldDelegatingVault, '0xBA2E7Fed597fd0E3e70f5130BcDbbFE06bB94fe1');

  //crvBUSD
  await deployer.deploy(YieldDelegatingVault, '0x2994529C0652D127b7842094103715ec5299bBed');
  
  //crvBTC
  await deployer.deploy(YieldDelegatingVault, '0x7Ff566E1d69DEfF32a7b244aE7276b9f90e9D0f6');

  //WETH
  await deployer.deploy(YieldDelegatingVault, '0xe1237aA7f535b0CC33Fd973D66cBf830354D16c7');
}
