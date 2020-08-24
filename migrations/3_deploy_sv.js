const  SampleToken = artifacts.require("SampleToken");
const  SampleVault = artifacts.require("SampleVault");
const  YieldDelegatingVault = artifacts.require("YieldDelegatingVault");

module.exports = async (deployer, network, accounts) => {
  await Promise.all ([deploySampleVault(deployer, network, accounts)]);
}

async function deploySampleVault (deployer, network, accounts) {
  await deployer.deploy(SampleToken);

  let st = new web3.eth.Contract(SampleToken.abi, SampleToken.address);
  
  await deployer.deploy(SampleVault, st.options.address);

  let sv = new web3.eth.Contract(SampleVault.abi, SampleVault.address);

  await st.methods.addMinter(sv.options.address).send({from: accounts[0]}); //make sure our vault can mint sample tokens for testing
  await st.methods.mint(accounts[0], web3.utils.toBN(10**3).mul(web3.utils.toBN(10**18)).mul(web3.utils.toBN(250)).toString()).send({from: accounts[0]}); //load up some tokens in a test account

  await deployer.deploy(YieldDelegatingVault, sv.options.address);
}
