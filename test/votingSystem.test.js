const VotingSystem = artifacts.require("VotingSystem");
const truffleAssert = require('truffle-assertions');
const { time } = require('../node_modules/@openzeppelin/test-helpers');

advanceTimeAndBlock = async (time) => {
    await advanceTime(time);
    await advanceBlock();

    return Promise.resolve(web3.eth.getBlock('latest'));
}

advanceTime = (time) => {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [time],
            id: new Date().getTime()
        }, (err, result) => {
            if (err) { return reject(err); }
            return resolve(result);
        });
    });
}

advanceBlock = () => {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: "2.0",
            method: "evm_mine",
            id: new Date().getTime()
        }, (err, result) => {
            if (err) { return reject(err); }
            const newBlockHash = web3.eth.getBlock('latest').hash;

            return resolve(newBlockHash)
        });
    });
}

contract("VotingSystem", accounts => { 
      
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

    //B: Voting Started
    it ('should allow to vote', async () => {
        let voteSystemInstance = await VotingSystem.deployed(choices, secsBeforeVotingStarts, votingDurationSecs);
        let timeDeployed = await time.latest();

        console.log("Time Before Time Increase: " + await voteSystemInstance.getBlockTimeStamp2());
        await advanceTimeAndBlock(secsBeforeVotingStarts); //time travel to 1 sec before voting is supposed to start
        console.log("Time After Time Increase: " + await voteSystemInstance.getBlockTimeStamp2());
        
        await truffleAssert.passes ( voteSystemInstance.vote(0, {from:accounts[0]}) );
        await voteSystemInstance.getNumberOfVote(0).then(function(v) {c1=v})
        assert.equal (c1.words[0], 1);

        await truffleAssert.reverts ( voteSystemInstance.vote(0, {from:accounts[0]}) ); //only can vote once

        await truffleAssert.passes ( voteSystemInstance.vote(0, {from:accounts[1]}) );
        await voteSystemInstance.getNumberOfVote(0).then(function(v) {c1=v})
        assert.equal (c1.words[0], 2);
    }) 

    //C: Voting period has ended
    it ('should not allow to vote', async () => {
        let voteSystemInstance = await VotingSystem.deployed(choices, secsBeforeVotingStarts, votingDurationSecs);
        let timeDeployed = await time.latest();

        console.log("Time Before Time Increase: " + await voteSystemInstance.getBlockTimeStamp2());
        await advanceTimeAndBlock(secsBeforeVotingStarts+votingDurationSecs); //time travel to 1 sec before voting is supposed to start
        console.log("Time After Time Increase: " + await voteSystemInstance.getBlockTimeStamp2());
        
        await truffleAssert.reverts ( voteSystemInstance.vote(0, {from:accounts[2]}) );
    }) 
    
})