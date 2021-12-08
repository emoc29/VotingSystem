const { accounts } = require("@openzeppelin/test-environment");

const VotingSystem = artifacts.require("VotingSystem");

module.exports = function (deployer) {

  deployer.deploy(VotingSystem,["Erwin", "Elsit", "Chres"], 15, 45);

  /* Execute the following commands in the console log to test

  votingSystemInstance = await VotingSystem.deployed();
  votingSystemInstance.deposit({value:web3.utils.toWei("0.2","ether")})
  votingSystemInstance.vote(0, {from: accounts[0]});
  votingSystemInstance.vote(0, {from: accounts[1]});
  votingSystemInstance.vote(1, {from: accounts[2]});
  votingSystemInstance.vote(2, {from: accounts[3]});

  votingSystemInstance.getNumberOfVote(0).then(function(v) {c1=v})
  votingSystemInstance.getNumberOfVote(1).then(function(v) {c2=v})
  votingSystemInstance.getNumberOfVote(2).then(function(v) {c3=v})

  vote1 = c1.words[0]
  vote2 = c2.words[0]
  vote3 = c3.words[0]
  */
};
