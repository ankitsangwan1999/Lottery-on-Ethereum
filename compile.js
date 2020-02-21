const path = require('path');
const fs = require('fs'); // gives access to the file-system on our local computer. a node module.
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'Contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf-8');
// console.log(solc.compile(source,1));
module.exports = solc.compile(source,1).contracts[':Lottery']; // To make our compiled contract available to the other files.

