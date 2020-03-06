import React from 'react';
import './App.css';
import web3 from './web3.js';
import lottery from './lottery.js'
import { Container, Label, Button, Input, Header, Divider, List, Message, Image, Reveal } from 'semantic-ui-react';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {manager: "", countPlayers: [], currentLotteryAmount: "", value: "", message: "", lastWinner: ""};
    }
    /*
        Some ECMA16 Syntac:
        state = {
            manager: ""
        };
    */

    async componentDidMount(){ // This is a Life-Cycle method which is called when the App component is rendered on the Screen.

        const manager = await lottery.methods.manager().call(); // No need to specify the From Property.
        const players = await lottery.methods.getPlayers().call();
        const countPlayers = players.length;
        const lastWinner = await lottery.methods.lastWinner().call();
        const currentLotteryAmount = await web3.eth.getBalance(lottery.options.address);
        this.setState({manager : manager, countPlayers: countPlayers, currentLotteryAmount: currentLotteryAmount, lastWinner: lastWinner});
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
    }

    onSubmit = async (event) => { // No need to bind the onSubmit function in the render function
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        const value = this.state.value;
        this.setState({message: 'Waiting on Trx Success...'});

        // console.log('ACCOUNTS ARRAY IS HERE:-');
        // console.log(accounts);
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.value, 'ether')
        });

        this.setState({message: 'You have Successfully Entered to the Lottery Contract. Wait For the Results.'});
    };

    onClick = async (event) => {
        const accounts = await web3.eth.getAccounts();
        this.setState({message: "Declaration of Winner in Progress..."});
        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        const lastWinner = await lottery.methods.lastWinner().call();
        this.setState({message: "And... The WINNER is " + lastWinner, lastWinner: lastWinner});
    };

    render(){

     //    let messages = "";
     //  if(this.state.message == ""){
     //      messages =  <Message positive>
     //                    <Message.Header>{this.state.message}</Message.Header>
     //                  </Message>;
     //  }
     //  else{
     //      messages="No Message to Show...";
     //  }
     //  console.log("What is the freaking Msg:-");
     // console.log(messages);


     return (
       <Container textAlign='center'>
            <Header
                as='h1'
                content='Lottery Contract'
                style={{
                    fontSize: '2em',
                    fontWeight: 'normal',
                    marginBottom: '10px',
                    marginTop: '1em',
                }}
            />
             <div>
                 <Label as='a' color='purple' image>
                     {this.state .manager}
                     <Label.Detail>MANAGER</Label.Detail>
                 </Label>

                 <Label as='a' color='green' image>
                     {this.state.countPlayers}
                     <Label.Detail>Participants</Label.Detail>
                 </Label>

                 <Label as='a' color='red' image>
                     {web3.utils.fromWei(this.state.currentLotteryAmount, 'ether')}
                     <Label.Detail>Ethers</Label.Detail>
                 </Label>
             </div>

           <Divider
                as='h4'
                className='header'
                horizontal
                style={{ margin: '3em 0em', textTransform: 'uppercase' }}
           >
               <a href='#'>Want to Try your LUCK...?</a>
            </Divider>

             <div style={{margin: '20px'}}>
                 <form onSubmit={this.onSubmit}>
                     <div>
                         <label>
                             <span style={{
                                    fontSize: '1em',
                                    fontWeight: 'bold'
                                }}>
                                 Amount of Ethers you want to Enter:  </span>
                         </label>
                         <Input
                             label="Ethers"
                             labelPosition='right'
                             placeholder="Value..."
                             value={this.state.value}
                             onChange={event => this.setState({value: event.target.value})}
                         />
                     </div>
                     <div style={{margin: '10px'}}>
                         <Button primary>Enter to Lottery!</Button>
                     </div>
                 </form>
             </div>

            <Divider
                as='h4'
                className='header'
                horizontal
                style={{ margin: '3em 0em', textTransform: 'uppercase' }}
           >
               <a href='#'>Ready to pick a Winner...?</a>
            </Divider>


           <div style={{margin: '10px'}}>
               <Button color='olive' size='huge' onClick={this.onClick}>Pick a WINNER!</Button>
           </div>


           <Divider
                as='h4'
                className='header'
                horizontal
                style={{ margin: '3em 0em', textTransform: 'uppercase' }}
           >
               <a href='#'>Status Messages...</a>
           </Divider>


           <Message positive>
               <Message.Header>{this.state.message ? this.state.message : 'No Current Messages to Show...'}</Message.Header>
           </Message>

           <Divider
                as='h4'
                className='header'
                horizontal
                style={{ margin: '3em 0em', textTransform: 'uppercase' }}
           >
               <a href='#'>Last Lottery Winner</a>
           </Divider>
           <div style={{textAlign:'center'}}>
               <p><b>{this.state.lastWinner ? this.state.lastWinner : 'No Winners Yet Declared...'}</b></p>
               <img style={{maxWidth: '250px', maxheight: '250px' }} src='/Lottery-on-Ethereum/images/trophy1.jpg' />

           </div>
       </Container>
     );

   }
}

export default App;



