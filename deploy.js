const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');


const provider = new HDWalletProvider(
	'####SEED PHRASE####', // to get The account List of the from metamask
	'####API LINK FOR INFURA NODE####'
);
 
const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();
	console.log("Attempting to deploy from Account",accounts[0]);
	const result = await new web3.eth.Contract(JSON.parse(interface))
			.deploy({data: bytecode})
			.send({gas: '1000000', from: accounts[0]});
	console.log(interface);
	console.log('Contract is deployed on the Rinkeby Public Test network at the Address: ',result.options.address);
};
deploy(); // Above Deploy Fucntion is just an helper function to use async and await syntax.
