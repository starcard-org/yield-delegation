const Controller = artifacts.require("Controller");
const YieldDelegatingVault = artifacts.require("YieldDelegatingVault");
const SampleToken = artifacts.require("SampleToken");

module.exports = async function(deployer) {
  let treasury = "0x6Ecbe1DB9EF729CBe972C83Fb886247691Fb6beb";
  let usdc_address = "0x597ad1e0c13bfe8025993d9e79c69e1c0233522e";

  await deployer.deploy(SampleToken);
  let sampleToken = new web3.eth.Contract(SampleToken.abi, SampleToken.address);

  await deployer.deploy(Controller, sampleToken.options.address);
  let controller = new web3.eth.Contract(Controller.abi, Controller.address);

  await deployer.deploy(
    YieldDelegatingVault,
    controller.options.address,
    usdc_address,
    treasury,
    "9000",
    "100000000000000",
    "100000000000"
  ); //proxy into yearn USDC vault
  
  sampleToken.methods.addMinter(controller.options.address);
};
