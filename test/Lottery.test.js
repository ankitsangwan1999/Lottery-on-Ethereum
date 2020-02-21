const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const {interface, bytecode} = require('../compile');

let lottery;
let accounts;

beforeEach( async() =>{
	accounts = await web3.eth.getAccounts();
	lottery = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({data : bytecode})
		.send({from: accounts[0],gas:'1000000'}); 
});

describe( "Lottery Contract", async() =>{

	it("Test: To see if the Contract is Deployed.", ()=>{
		assert.ok(lottery.options.address);
	});

	it("Test: Allows One Account to Enter.", async ()=> {
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei('0.02', 'ether')
		});

		const players = await lottery.methods.getPlayers().call({
			from: accounts[0] 
		});

		assert.equal(accounts[0], players[0]);
		assert.equal(1,players.length);
	});

	it("Test: Allows Multiple Account to Enter.", async ()=> {
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei('0.02', 'ether')
		});
		await lottery.methods.enter().send({
			from: accounts[1],
			value: web3.utils.toWei('0.02', 'ether')
		});
		await lottery.methods.enter().send({
			from: accounts[2],
			value: web3.utils.toWei('0.02', 'ether')
		});

		const players = await lottery.methods.getPlayers().call({
			from: accounts[0] 
		});

		assert.equal(accounts[0], players[0]);
		assert.equal(accounts[1], players[1]);
		assert.equal(accounts[2], players[2]);
		assert.equal(3,players.length);
	});

	it("Test: Enter requires a minimum amount of Ether to call.",async ()=>{
		
		try{
			await lottery.methods.enter().send({
				from: accounts[0], 
				value: web3.utils.toWei('0.1', 'ether')
			});
			assert(false);
		} catch (err){
			assert(err);
		}
	});

	it("Test: If the Manager is Calling the pick Winner or Not.",async ()=>{
		try{
			await lottery.methods.pickWinner().send({
				from: accounts[0], 
			});
			assert(false);
		} catch (err){
			assert(err);
		}
	});

	it("Test: If the Money is transferred to the winner and players List is Emptyied.", async ()=>{
		await lottery.methods.enter().send({
			from: accounts[0], 
			value: web3.utils.toWei('2', 'ether')
		});

		const init_bal = await web3.eth.getBalance(accounts[0]);

		await lottery.methods.pickWinner().send({
			from: accounts[0], 
		});

		const final_bal = await web3.eth.getBalance(accounts[0]);
		const diff = final_bal - init_bal;
		assert(diff > web3.utils.toWei('1.9','ether'));

	});
	// test to check whether the player array is emptied or not.
	// test to check if the lottery balance becomes 0 or not after the pickWinner fucntion call.
});
