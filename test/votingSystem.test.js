const VotingSystem = artifacts.require("VotingSystem");
const truffleAssert = require('truffle-assertions');
const { time } = require('../node_modules/@openzeppelin/test-helpers');

async function timeIncreaseTo (seconds) {
    const delay = 1000 - new Date().getMilliseconds();
    await new Promise(resolve => setTimeout(resolve, delay));
    await time.increaseTo(seconds);
}

contract("VotingSystem", accounts => { 

    before(async function () {
        // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
        await time.advanceBlock();
      });
      
    var secsBeforeVotingStarts, votingDurationSecs, timeDeployed, c1,c2,c3;
    var choices = ["Erwin", "Chres", "Elsit"];
    var secsBeforeVotingStarts = 30;
    var votingDurationSecs = 3600;

    //A: Test After Contract is Deployed (Before Voting Starts)
    it ('should not allow to vote', async () => {
        let voteSystemInstance = await VotingSystem.deployed(choices, secsBeforeVotingStarts, votingDurationSecs);
        await truffleAssert.reverts ( voteSystemInstance.vote(0, {from:accounts[0]}) );

        await voteSystemInstance.getNumberOfVote(0).then(function(v) {c1=v})
        assert.equal (c1.words[0], 0);

        await voteSystemInstance.getNumberOfVote(1).then(function(v) {c2=v})
        assert.equal (c2.words[0], 0);

        await voteSystemInstance.getNumberOfVote(2).then(function(v) {c3=v})
        assert.equal (c3.words[0], 0);
    })

    //B: Test After Certain Time has elapsed after Contract is Deployed (Before Voting supposed to start)
    it ('should not allow to vote before voting starts', async () => {
        let voteSystemInstance = await VotingSystem.deployed(choices, secsBeforeVotingStarts, votingDurationSecs);
        let timeDeployed = await time.latest();

        console.log("Time Before Time Increase: " + await voteSystemInstance.getBlockTimeStamp2());
        await timeIncreaseTo(timeDeployed.add(time.duration.seconds(secsBeforeVotingStarts-1)));//travel to 1sec before voting is supposed to start
        await time.advanceBlock();
        console.log("Time After Time Increase: " + await voteSystemInstance.getBlockTimeStamp2());
        
        await truffleAssert.reverts ( voteSystemInstance.vote(0, {from:accounts[0]}) );
        await voteSystemInstance.getNumberOfVote(0).then(function(v) {c1=v})
        assert.equal (c1.words[0], 0);
    }) 
    /*
    //C: Voting Started
    it ('should allow to vote', async () => {
        let voteSystemInstance = await VotingSystem.deployed(choices, secsBeforeVotingStarts, votingDurationSecs);
        let timeDeployed = await time.latest();

        console.log("Time Before Time Increase: " + await voteSystemInstance.getBlockTimeStamp2());
        await timeIncreaseTo(timeDeployed.add(time.duration.seconds(secsBeforeVotingStarts+1)));//travel to 1sec before voting is supposed to start
        console.log("Time After Time Increase: " + await voteSystemInstance.getBlockTimeStamp2());
        
        await truffleAssert.passes ( voteSystemInstance.vote(0, {from:accounts[0]}) );
        await voteSystemInstance.getNumberOfVote(0).then(function(v) {c1=v})
        assert.equal (c1.words[0], 1);

        await truffleAssert.reverts ( voteSystemInstance.vote(0, {from:accounts[0]}) ); //only can vote once

        await truffleAssert.passes ( voteSystemInstance.vote(0, {from:accounts[1]}) );
        await voteSystemInstance.getNumberOfVote(0).then(function(v) {c1=v})
        assert.equal (c1.words[0], 2);
    }) 

    //D: 1 second before Voting Ends
    it ('should allow to vote', async () => {
        let voteSystemInstance = await VotingSystem.deployed(choices, secsBeforeVotingStarts, votingDurationSecs);
        let timeDeployed = await time.latest();

        console.log("Time Before Time Increase: " + await voteSystemInstance.getBlockTimeStamp2());
        await timeIncreaseTo(timeDeployed.add(time.duration.seconds(secsBeforeVotingStarts+votingDurationSecs-1)));//travel to 1sec before voting is supposed to start
        console.log("Time After Time Increase: " + await voteSystemInstance.getBlockTimeStamp2());
        
        await truffleAssert.passes ( voteSystemInstance.vote(1, {from:accounts[2]}) );
        await voteSystemInstance.getNumberOfVote(1).then(function(v) {c1=v})
        assert.equal (c1.words[0], 1);
    }) 

    //E: Voting period has ended
    it ('should not allow to vote', async () => {
        let voteSystemInstance = await VotingSystem.deployed(choices, secsBeforeVotingStarts, votingDurationSecs);
        let timeDeployed = await time.latest();

        console.log("Time Before Time Increase: " + await voteSystemInstance.getBlockTimeStamp2());
        await timeIncreaseTo(timeDeployed.add(time.duration.seconds(secsBeforeVotingStarts+votingDurationSecs+1)));//travel to 1sec before voting is supposed to start
        console.log("Time After Time Increase: " + await voteSystemInstance.getBlockTimeStamp2());
        
        await truffleAssert.reverts ( voteSystemInstance.vote(0, {from:accounts[2]}) );
    }) 
    */
})