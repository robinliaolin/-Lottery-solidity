pragma solidity ^0.4.0;

contract lottery {
    address public manager;
    address[] public players;

    function lottery() public{
        manager = msg.sender;
    }

    function getManager() public view returns(address){
        return manager;
    }
    function getPlayers() public view returns(address[]){
        return players;
    }
    function getPlayersCount() public view returns(uint){
        return players.length;
    }
    function getBalance() public view returns(uint){
        return address(this).balance;
    }
    function enter() public payable{
        require(msg.value== 1 ether);
        players.push(msg.sender);
    }
    function randomIndex() private view returns(uint){
        return uint(keccak256(block.difficulty,now,players));
    }
    //一般转账的操作不能有返回值，因为有漏洞，为了保护中奖者的权益，如果有返回值，返回的是transation交易的id值。
    function pickWinner() public onlyManagerAlow{
        uint index = randomIndex()%players.length;
        address winner = players[index];
        players = new address[](0);
        winner.transfer(address(this).balance);
    }
    function refund() public onlyManagerAlow{
        for(uint i=0;i<players.length;i++){
            players[i].transfer(1 ether);
        }
        players = new address[](0);
    }
    modifier onlyManagerAlow(){
        require(msg.sender==manager);
        _;
    }
}
