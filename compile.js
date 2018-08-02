const fs = require('fs');
const path = require('path');
const solc= require('solc');

const srcpath = path.resolve(__dirname,"contracts","lottery.sol");
const source = fs.readFileSync(srcpath,'utf-8');
const result= solc.compile(source,1);
console.log(result)
module.exports = result.contracts[":lottery"];