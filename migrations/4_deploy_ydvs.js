const YieldDelegatingVault = artifacts.require("YieldDelegatingVault");
const RallyToken = artifacts.require("RallyToken");
const YDVRewardsDistributor = artifacts.require("YDVRewardsDistributor");

module.exports = async function(deployer, network, accounts) {
  if (network == 'mainnet' || network == 'development') {
    await deployer.deploy(YDVRewardsDistributor, RallyToken.address);

    let treasury = process.env.TREASURY;

    let usdc_address = "0x597ad1e0c13bfe8025993d9e79c69e1c0233522e";
    let ycrv_address = '0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c';
    let tusd_address = '0x37d19d1c4E1fa9DC47bD1eA12f742a0887eDa74a';
    let dai_address = '0xACd43E627e64355f1861cEC6d3a6688B31a6F952';
    let usdt_address = '0x2f08119C6f07c006695E079AAFc638b8789FAf18';
    let yfi_address = '0xBA2E7Fed597fd0E3e70f5130BcDbbFE06bB94fe1';
    let crvbusd_address = '0x2994529C0652D127b7842094103715ec5299bBed'; 
    let crvbtc_address = '0x7Ff566E1d69DEfF32a7b244aE7276b9f90e9D0f6';
    let weth_address = '0xe1237aA7f535b0CC33Fd973D66cBf830354D16c7';

    let proxied_addresses = [usdc_address, ycrv_address, tusd_address, dai_address, usdt_address, yfi_address, crvbusd_address, crvbtc_address, weth_address];

    let rewards = new web3.eth.Contract(YDVRewardsDistributor.abi, YDVRewardsDistributor.address);
    
    for (proxied_address of proxied_addresses) {
      let ydv = await deployer.deploy(
        YieldDelegatingVault,
        proxied_address,
        YDVRewardsDistributor.address,
        treasury,
        "9000",
        "1000000000000000000000000000",
        "1000000000000000000000000000",
        "500000000000000000"
      );
      rewards.methods.addYDV(ydv.address).send({from:accounts[0]});
    }
  }
};



