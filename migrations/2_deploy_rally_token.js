const  RallyToken = artifacts.require("RallyToken");

module.exports = async (deployer, network, accounts) => {
  await Promise.all ([deployRallyToken(deployer, network, accounts)]);
}

async function deployRallyToken (deployer, network, accounts) {
  await deployer.deploy(RallyToken, process.env.TOKEN_ESCROW);
}
