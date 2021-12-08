const { accounts } = require("@openzeppelin/test-environment");

const VotingSystem = artifacts.require("VotingSystem");

module.exports = function (deployer) {

  deployer.deploy(VotingSystem,["Erwin", "Elsit", "Chres"], 15, 45);

  /* Execute the following commands in the console log to test
  v = await VotingSystem.deployed();
  v.deposit({value:web3.utils.toWei("0.2","ether")})
  v.vote(0, {from: accounts[0]});
  v.vote(0, {from: accounts[1]});
  v.vote(1, {from: accounts[2]});
  v.vote(2, {from: accounts[3]});

  v.getNumberOfVote(0).then(function(w) {c1=w})
  v.getNumberOfVote(1).then(function(w) {c2=w})
  v.getNumberOfVote(2).then(function(w) {c3=w})

  vote1 = c1.words[0]
  vote2 = c2.words[0]
  vote3 = c3.words[0]

  web3.eth.getBalance(accounts[0])

  v.createNewElection(["Erwin", "Elsit", "Chres"], 15, 45, {value: web3.utils.toWei('0.11', 'ether')})
  */
};
