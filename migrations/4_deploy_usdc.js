const YieldDelegatingVault = artifacts.require("YieldDelegatingVault");
const RallyToken = artifacts.require("RallyToken");

module.exports = async function(deployer, network, accounts) {
  if (network == 'mainnet' || network == 'development') {
    let controller = process.env.CONTROLLER;
    let treasury = process.env.TREASURY;
    let yusdc_address = "0x597ad1e0c13bfe8025993d9e79c69e1c0233522e"; //yearn usdc vault

    console.log("controller = " + controller);
    console.log("treasury = " + treasury);

    await deployer.deploy(
      YieldDelegatingVault,
      controller,
      yusdc_address,
      RallyToken.address,
      treasury,
      "9000", //out of 10000
      "100000000000000", //global deposit cap
      "100000000000" //per deposit cap
    ); //proxy into yearn USDC vault
  }
};
