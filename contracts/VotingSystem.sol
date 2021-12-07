pragma solidity 0.8.0;

contract VotingSystem {

    struct Choice {
        string name;
        uint voteCounts;
        address[] voters;
    }

    struct Voter {
        bool voted;
    }

    uint256 startTime; //how many secs after contract is deployed before voting starts
    uint256 endTime; //counts after voting has started

    Choice[] public choices; //store voters input
    mapping (address => Voter) public voters;

    modifier allowedToVote
    {
        require (block.timestamp >= startTime, "Voting period has not started yet");
        require (block.timestamp < endTime, "Voting period has ended");
        require (voters[msg.sender].voted == false, "Voter already used his/her right to vote.");
        _;
    }

    constructor(string[] memory _choices, uint256 _timeBeforeVotingStartInSecs, uint256 _votingDurationInSecs)
    {
        for (uint idx = 0; idx < _choices.length; idx++)
        {
            Choice memory init;
            init.name = _choices[idx];
            init.voteCounts = 0;
            choices.push(init);
        }
        startTime = block.timestamp + _timeBeforeVotingStartInSecs;
        endTime = startTime + _votingDurationInSecs;
    }

    function vote (uint _choicesIdx) public allowedToVote
    {
        require(_choicesIdx >= 0 && _choicesIdx < choices.length, "vote is outside the range of available choices");
        voters[msg.sender].voted = true;
        choices[_choicesIdx].voteCounts += 1;
        choices[_choicesIdx].voters.push(msg.sender);
    }

    function getNumberOfVote (uint _choicesIdx) public view returns (uint)
    {
        require(_choicesIdx >= 0 && _choicesIdx < choices.length, "vote is outside the range of available choices");
        return choices[_choicesIdx].voteCounts;
    }

    function getChoices () public view returns (Choice[] memory)
    {
        return choices;
    }

    function getVotingState() public returns (string memory)
    {
        if (block.timestamp < startTime)
        {
            return "Voting has not started";
        }
        else if (block.timestamp < endTime)
        {
            return "Voting in progress";
        }
        else 
        {
            return "Voting has ended";
        }
    }

    function getBlockTimeStamp() public returns (uint)
    {
        return block.timestamp;
    }
}