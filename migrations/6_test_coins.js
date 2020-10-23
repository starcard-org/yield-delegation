const ERC20 = artifacts.require("ERC20");

module.exports = async function(deployer, network, accounts) {
 if (network == 'development') { 
  console.log ('loading development test coins');
/*  let usdc = new web3.eth.Contract(ERC20.abi, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
  await usdc.methods.transfer(accounts[0], '1000000000').send({from:'0x1152ef352834922ba1b1f8dfc97fbaa041eff4b4'});

  let ycrv = new web3.eth.Contract(ERC20.abi, '0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8');
  await ycrv.methods.transfer(accounts[0], '1000000000000000000000').send({from:'0x1714A5badf44F9Aade2E902eb083b80f6d4129a2'});

  let tusd = new web3.eth.Contract(ERC20.abi, '0x0000000000085d4780B73119b644AE5ecd22b376');
  await tusd.methods.transfer(accounts[0], '1000000000000000000000').send({from:'0xaae19c623A3dF62290Ac999D94ac930939B840b3'});

  let dai = new web3.eth.Contract(ERC20.abi, '0x6B175474E89094C44Da98b954EedeAC495271d0F');
  await dai.methods.transfer(accounts[0], '1000000000000000000000').send({from:'0x223034EDbe95823c1160C16F26E3000315171cA9'});

  let usdt = new web3.eth.Contract(ERC20.abi, '0xdAC17F958D2ee523a2206206994597C13D831ec7');
  await usdt.methods.transfer(accounts[0], '1000000000').send({from:'0x778476d4c51f93078d61e51c978f90b4a6e500af'});

  let yfi = new web3.eth.Contract(ERC20.abi, '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e');
  await yfi.methods.transfer(accounts[0], '10000000000000000000').send({from:'0x649455d5e4eefdF9381E6Af090A13b4105AbfA06'});

  let crvBUSD = new web3.eth.Contract(ERC20.abi, '0x3B3Ac5386837Dc563660FB6a0937DFAa5924333B');
  await crvBUSD.methods.transfer(accounts[0], '1000000000000000000000').send({from:'0x7Bb53A7c80652963fA6e613DCF97A58335cdc466'});

  let crvBTC = new web3.eth.Contract(ERC20.abi, '0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3');
  await crvBTC.methods.transfer(accounts[0], '1000000000000000000').send({from:'0xdd5BF2495556d79b8c9c5c226c4B95f957BE84bd'});

  let weth = new web3.eth.Contract(ERC20.abi, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');
  await weth.methods.transfer(accounts[0], '100000000000000000000').send({from:'0x98Ba17C7d27beE73A2f4DcF6581CdF4D67911339'});
*/
  let crv3pool = new web3.eth.Contract(ERC20.abi, '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490');
  await crv3pool.methods.transfer(accounts[0], '1000000000000000000000').send({from:'0xcee564d87985e3ef80e8d0cea1d8f49278fee135'});
 }
};
