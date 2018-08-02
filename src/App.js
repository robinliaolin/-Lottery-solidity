import React, { Component } from 'react';
import {Container,Image,Card,Icon,Label,Button} from 'semantic-ui-react';
import lottery from './lottery';
import web3 from './web';
class App extends Component {
    constructor(props){
        super(props);
        this.state={
            managerAddress:"",
            timeless:8*60*60,
            players:0,
            balances:0,
            showButtons:'none',
            showLoading:false,
        }
    }
    async componentDidMount(){
        console.log("当前web3的版本："+web3.version);
        let manager = await lottery.methods.getManager().call();
        let players = await lottery.methods.getPlayers().call();
        let accounts = await web3.eth.getAccounts();
        let balances = await lottery.methods.getBalance().call();
        this.setState({balances:web3.utils.fromWei(balances,'ether')});
        let showBtnStr="";
        if(manager===accounts[0]){
            showBtnStr="inline"
        }
        else {
            showBtnStr="none"
        }
        this.startInterval();
        this.setState({
            managerAddress:manager,
            players:players===undefined?players:0,
            showButtons:showBtnStr,
        })
    }
    startInterval=()=>{
        let timeless1 = this.state.timeless;
        setInterval(()=>{
            timeless1=timeless1-1;
            if((timeless1===0||this.state.players===10)&&this.state.balances!==0){
                this.getWinner()
            }
            this.setState({
                timeless:timeless1,
            })
            console.log(this.state.timeless)
        },1000)
    }
    enter = async()=>{
        this.setState({showLoading:true});
        let accounts = await web3.eth.getAccounts();
        try {
            await lottery.methods.enter().send({
                from:accounts[0],
                value:"1000000000000000000"
            })
        }
        catch (e) {
            console.log(e.toString())
        }
        this.setState({showLoading:false});
        window.location.reload(true);
    }
    getWinner =async ()=>{
        //如果开奖业务有可能需要暂停，那么可以加上try、catch结构来执行。
        this.setState({showLoading:true});
        await lottery.methods.pickWinner().send({
            from:this.state.managerAddress,
        });
        this.setState({
            players:0,
            balances:0,
            showLoading:false
        });
        window.location.reload(true);
    }
    refund = async ()=>{
        this.setState({showLoading:true});
        await lottery.methods.refund().send({
            from:this.state.managerAddress,
        });
        this.setState({
            players:0,
            balances:0,
            showLoading:false
        });
        window.location.reload(true);
    }
    render() {
        let hour = parseInt(this.state.timeless/(60*60)) ;
        let mins = parseInt(this.state.timeless%(60*60)/60);
        let secs = parseInt(this.state.timeless%(60*60)%60);
        let playersCount=0;
        if (this.state.players===0){
            playersCount=0;
        }
        else playersCount = this.state.players;
        return (
            <Container >
                <Card>
                    <Image src='/imgs/logo.jpg' />
                    <Card.Content>
                        <Card.Header>六合彩</Card.Header>
                        <Card.Meta>
                            <span className='date'>管理员地址</span>
                            <br/>
                        </Card.Meta>
                        <Label size="mini">{this.state.managerAddress}</Label>
                        <Label >奖池人数达到10人或满8小时即开奖:</Label>
                        <Label>{hour}:{mins}:{secs}</Label>
                    </Card.Content>
                    <Card.Content extra>
                        <a>
                            <Icon name='user' />&nbsp;
                            {playersCount}人参与
                        </a>
                        <br/>
                        <Label size="massive" style={{width:"100%"}}>{this.state.balances} ether</Label>
                    </Card.Content>
                    <Card.Content extra>
                        <Button animated='fade' fluid  onClick={this.enter} loading={this.state.showLoading} disabled={this.state.showLoading}>
                            <Button.Content visible>点击成就梦想</Button.Content>
                            <Button.Content hidden>开奖放飞自我</Button.Content>
                        </Button>
                        <Button style={{display:this.state.showButtons}} fluid color="blue" onClick={this.getWinner} loading={this.state.showLoading} disabled={this.state.showLoading}>开奖</Button>
                        <Button style={{display:this.state.showButtons}} fluid color="red" onClick={this.refund} loading={this.state.showLoading} disabled={this.state.showLoading}>退款</Button>
                    </Card.Content>
                </Card>
            </Container>
        );
    }
}

export default App;

