import Web3 from 'web3';

const web3 = new Web3(window.web3.currentProvider); 
// Creating a new copy of Local Web3 and using the provider of the MetaMask. 

export default web3;