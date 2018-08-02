const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = "believe original anxiety flip topple divorce later fence hard boy garbage impose";
const provider = new HDWalletProvider(mnemonic,"https://rinkeby.infura.io/v3/0a12e56321594355b0c928b3a19c11cb");

const {interface,bytecode} = require('./compile');
const web3 = new Web3(provider);

deploy = async ()=>{
    console.log(interface)
    console.log(bytecode)
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0])
    const result = await new web3.eth.Contract(JSON.parse(interface)).deploy({
        data:bytecode
    }).send({
        from:accounts[0],
        gas:'7000000'
    })
    console.log("部署的合约地址:"+result.options.address);
    console.log("_______________________")
    console.log(interface);
}
deploy();