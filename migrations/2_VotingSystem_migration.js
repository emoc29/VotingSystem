const VotingSystem = artifacts.require("VotingSystem");

module.exports = function (deployer) {

  deployer.deploy(VotingSystem,["Erwin", "Elsit", "Chres"], 15, 45);
};
