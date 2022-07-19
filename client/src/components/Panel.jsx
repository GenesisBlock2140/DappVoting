import { useState, useEffect } from "react";
import useEth from "../contexts/EthContext/useEth";

// Import Components
import AdminPanel from './AdminPanel';
import Connected from './Connected';
import Footer from './Footer';

function Panel() {

    const { state: { contract, accounts } } = useEth();

    // Request useState
    const [isOwner, setIsOwner] = useState(false);
    const [errorValue, setErrorValue] = useState(null);
    const [result, setResult] = useState("");
    const [proposalList, setProposalList] = useState([]);
    
    // WorkflowStatut 
    const [currentState, setCurrentState] = useState(0);

    // Input Value useState
    const [getVoterInfosInput,setGetVoterInfosInput] = useState("");
    const [getOneProposalInput,setGetOneProposalInput] = useState("");
    const [setVoteInput,setSetVoteInput] = useState("");
    const [addProposalInput,setAddProposalInput] = useState("");

    useEffect(() => {
        if(contract != null){
            async function fetchData() {
                // Check if the address is the owner of contract
                const data = await contract.methods.owner().call( {from: accounts[0]} );
                if(data === accounts[0] ){
                    setIsOwner(true);
                }
            

                // Get proposal for list

                let options = {
                    fromBlock: 0,            
                    toBlock: 'latest'
                };
                if(proposalList.length === 0){
                    const listProposals = await contract.getPastEvents('ProposalRegistered', options);
                    console.log(listProposals);
                    for (let i = 0; i < listProposals.length; i++) {
                        const props = await contract.methods.getOneProposal(i).call( {from: accounts[0]} );
                        setProposalList(prev => ([...prev, props.description]));
                    }
                }


            }
            fetchData();
        }
    },[accounts, contract, proposalList]);

    // Workflow useEffect
    useEffect(() => {
        if(contract != null){
            async function fetchData() {
                const workflow = await contract.methods.workflowStatus().call( {from: accounts[0]} );
                setCurrentState(workflow);
            }
            fetchData();

            contract.events.WorkflowStatusChange(() => {
            }).on("data", function(info){
                console.log("Workflow Change");
                console.log(info);
                setCurrentState(info.returnValues.newStatus);
            });
        }
    }, [currentState, accounts, contract]);

    // Handle Function for each buttons
    async function handleGetVoter() {
        if (getVoterInfosInput.length === 42) {
            try {
                const dataVoter = await contract.methods.getVoter(getVoterInfosInput).call( {from: accounts[0]} ); 
                console.log(dataVoter);
                console.log(dataVoter.isRegistered);
                setResult(" this address is " + ((dataVoter.isRegistered) ? "whitelist , " : "not whitelist , ") + ((dataVoter.hasVoted) ? "and vote for proposal " + dataVoter.votedProposalId : "and didnt vote now"));
            } catch (error) {
                if(error.toString().includes("not a voter")){
                    setErrorValue("You're not a voter");
                }else{
                    setErrorValue("Something is wrong with this address (format)");
                }
                console.log(error);
            }
        }
    }
    
    async function handleOneProposal() {
        if (getOneProposalInput >= 0) {
            try {
                const data = await contract.methods.getOneProposal(getOneProposalInput).call( {from: accounts[0]} );
                setResult(" " + ((data.description) + " have " + data.voteCount + " vote now."));
                console.log(data);
            } catch (error) {
                if(error.toString().includes("not a voter")){
                    setErrorValue("You're not a voter");
                }else{
                    setErrorValue("Please select valid proposal ID");
                }
                console.log(error);
            }
        }
    }

    async function handleAddProposal() {
        if (addProposalInput.length > 0) {
            try {
                const data = await contract.methods.addProposal(addProposalInput).send( {from: accounts[0]} ); 
                console.log(data);
                setProposalList(prev => ([...prev, addProposalInput]));
            } catch (error) {
                if(error.toString().includes("not a voter")){
                    setErrorValue("You're not a voter");
                }else{
                    setErrorValue("Proposals are not allowed yet or too many proposals.");
                }
                console.log(error);
            }
        }
    }

    async function handleSetVote() {
        try {
            const data = await contract.methods.setVote(setVoteInput).send( {from: accounts[0]} ); 
            console.log(data);
        } catch (error) {
            if(error.toString().includes("not a voter")){
                setErrorValue("You're not a voter");
            }else if(error.toString().includes("Voting session havent started yet")) {
                setErrorValue("Voting session havent started yet");
            }else if(error.toString().includes("You have already voted")) {
                setErrorValue("You have already voted");
            } else {
                setErrorValue("Something is wrong with the vote ID");
            }
            console.log(error);
        }
    }

    async function handleGetWinner() {
            try {
                const data = await contract.methods.winningProposalID().call( {from: accounts[0]} ); 
                console.log(data);
                setResult(" The winner ID is " + data);
            } catch (error) {
                setErrorValue("Something is wrong, maybe no winner yet.");
                console.log(error);
            }
    }
    // Change Function for each inputs

    function changeGetVoterInfosInput(e) {
        if (e.target.value.length === 42) {
            setGetVoterInfosInput(e.target.value);
            console.log("setGetVoterInfosInput is now : " + e.target.value);
        }
    }

    function changeGetOneProposalInput(e) {
        setGetOneProposalInput(e.target.value);
    }

    function changeSetVoteInput(e) {
        setSetVoteInput(e.target.value);
    }

    function changeAddProposalInput(e) {
        setAddProposalInput(e.target.value);
    }

    return (
        <div className="App">
            {contract && <Connected accounts={accounts[0]} />}

            {errorValue && <div className='error-info slide-in-right'>
                <p>Error: {errorValue} <span onClick={()=>{setErrorValue(null)}}>[X]</span></p>
            </div>}


            <div className="box-panel">
                <div className='box-input'>
                    <p className='box-input-title'>Add Proposal</p>
                    <input type='text' onChange={(e) => changeAddProposalInput(e)} />
                    <button className='box-input-btn' onClick={handleAddProposal} disabled={currentState === "1" ? false : true}>Submit proposal</button>
                </div>

                <div className='box-input'>
                    <p className='box-input-title'>Vote</p>
                    <input type='text' onChange={(e) => changeSetVoteInput(e)} />
                    <button className='box-input-btn' onClick={handleSetVote} disabled={currentState === "3" ? false : true}>Set Vote</button>
                </div>

                <div className='box-input'>
                    <p className='box-input-title'>Get Voter Infos</p>
                    <input type='text'onChange={(e) => changeGetVoterInfosInput(e)} />
                    <button className='box-input-btn' onClick={handleGetVoter}>Voter Infos</button>
                </div>

                <div className='box-input'>
                    <p className='box-input-title'>Get Proposal Infos</p>
                    <input type='text' onChange={(e) => changeGetOneProposalInput(e)}/>
                    <button className='box-input-btn' onClick={handleOneProposal} disabled={currentState >= "1" ? false : true} >getOneProposal</button>
                </div>

                <div className='box-input'>
                    <button className='box-input-btn' onClick={handleGetWinner} disabled={currentState === "5" ? false : true} >Get Winner</button>
                </div>

            </div>

            <div className='result-info'>
                <p>Result: <i>{result}</i></p>
            </div>

            <div className="box-panel">
                <div>
                    <p>Current State {currentState}/5</p>
                </div>
                <ul className='proposal-list'>
                <h2 className='proposal-list'>Proposals List</h2>
                    {proposalList.map((proposal,key)=> {
                        return(<li key={key}>{proposal}</li>)
                    })}
                </ul>
            </div>

            {isOwner && <AdminPanel/>}
            <Footer />
        </div>
    );
}

export default Panel;