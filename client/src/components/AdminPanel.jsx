import { useState } from "react";
import useEth from "../contexts/EthContext/useEth";

function AdminPanel() {
    const { state: { contract, accounts } } = useEth();
    const [valueAddress, setValueAddress] = useState("");

    function changeAddressValue(e) {
        if (e.target.value.length === 42) {
            setValueAddress(e.target.value);
            console.log(e.target.value);
        }
    }

    async function handleAddVoter() {
        if (valueAddress.length === 42) {
            try {
                await contract.methods.addVoter(valueAddress).send( {from: accounts[0]} );
                console.log("new voter add");
            } catch (error) {
                console.log(error);
            }
        }
    }

    async function handleTallyVote() {
        await contract.methods.tallyVotes().send( {from: accounts[0]} );
    }

    async function handleStartProposal() {
        await contract.methods.startProposalsRegistering().send( {from: accounts[0]} );
    }

    async function handleEndProposal() {
        await contract.methods.endProposalsRegistering().send( {from: accounts[0]} );
    }

    async function handleStartVoting() {
        await contract.methods.startVotingSession().send( {from: accounts[0]} );
    }
    
    async function handleEndVoting() {
        await contract.methods.endVotingSession().send( {from: accounts[0]} );
    }
    
    return (
        <div className="App">
            <div className="box-panel">

                <div className='box-input'>
                    <p className='box-input-title'>Add Voter</p>
                    <input type='text' onChange={(e) => changeAddressValue(e)} />
                    <button className='box-input-btn' onClick={handleAddVoter} >Add New Voter</button>
                </div>

                <div className='box-input'>
                <p className='box-input-title'>Tally Vote</p>
                    <button className='box-input-btn' onClick={handleTallyVote} >Use Tally Vote</button>
                </div>

                <div className='box-input'>
                    <p className='box-input-title'>Start Proposal</p>
                    <button className='box-input-btn' onClick={handleStartProposal}>Start Proposal Now</button>
                </div>

                <div className='box-input'>
                    <p className='box-input-title'>End Proposal</p>
                    <button className='box-input-btn' onClick={handleEndProposal}>End Proposal Now</button>
                </div>

                <div className='box-input'>
                    <p className='box-input-title'>Start Voting</p>
                    <button className='box-input-btn' onClick={handleStartVoting}>Start Voting Now</button>
                </div>

                <div className='box-input'>
                    <p className='box-input-title'>End Voting</p>
                    <button className='box-input-btn' onClick={handleEndVoting}>End Voting Now</button>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;