const RallySnapshotScore = artifacts.require("RallySnapshotScore.sol");

module.exports = function(deployer) {
  deployer.deploy(RallySnapshotScore);
};
