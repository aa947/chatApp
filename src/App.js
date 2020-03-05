import React from 'react'
import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import RoomList from './components/RoomList'
import NewRoomForm from './components/NewRoomForm';
import Dotenv from 'dot-env';
import Chatkit from '@pusher/chatkit-client'

// import {
//     ChatkitProvider,
//     TokenProvider,
//     withChatkit,

//   } from "@pusher/chatkit-client-react";


//   const instanceLocator = process.env.REACT_APP_INCTANSE_LOCATOR;

//   const userId = "ahmad";

//   const tokenProvider = new TokenProvider({
//     url: process.env.REACT_APP_URL,
//   });

class App extends React.Component {

  constructor() {
    super()
    this.state = {
        messages: [],
        joinableRooms: [],
        joinedRooms :[],
        roomId:null
    }

    this.sendMessage = this.sendMessage.bind(this);
    this.subscribeToRoom = this.subscribeToRoom.bind(this);
    this.getRooms = this.getRooms.bind(this)
    this.createRoom = this.createRoom.bind(this)


} 


  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: process.env.REACT_APP_INCTANSE_LOCATOR,
      userId: 'ahmad',
      tokenProvider: new Chatkit.TokenProvider({
        url: process.env.REACT_APP_URL,
      })
    })


    chatManager.connect()
      .then(currentUser => {
        // console.log('Successful connection', currentUser)

        /*
        * Assign Current User To ba accesible In the class outside of this promise
        */
        this.currentUser = currentUser;

     //   this.subscribeToRoom('e269bb36-f3a0-450c-8635-397d00988c92');
        this.getRooms();

       
      
        // this.currentUser.fetchMultipartMessages({
        //   roomId: 'e269bb36-f3a0-450c-8635-397d00988c92',
        //   //initialId: 42,
        //  // direction: 'older',
        //   limit: 10,
        // })
        //   .then(messages => {
        //     // do something with the messages
        //    // console.log('msgs ......', messages);
        //   })
        //   .catch(err => {
        //     console.log(`Error fetching messages: ${err}`)
        //   })
      })
      .catch(err => {
        console.log('Error on connection', err)
      })

//component did mount
  }


  /*
  * Fetch All Existed Rooms
  */     
  getRooms(){
  this.currentUser.getJoinableRooms()
  .then(joinableRooms => {
      this.setState({
          joinableRooms,
          joinedRooms: this.currentUser.rooms
          
      })
  })
  .catch(err => {
    console.log('Error onFetching Rooms', err)
  })
}



 /*
  * Fetch All Existed Messages and Listen to New Ones
  */
  subscribeToRoom(roomId) {
    this.setState({messages:[]});
    this.currentUser.subscribeToRoomMultipart({
      roomId: roomId,
      hooks: {
        onMessage: message => {
          // console.log("received message", message);
          this.setState({
            messages: [...this.state.messages, message]
            //messages: this.state.messages.push(message)
        })
        }
      },
      messageLimit: 10
    })
    .then(room => {
      this.setState({
        roomId: room.id
    })
      this.getRooms()
      })
    .catch(err => {
      console.log('Error on Fetching Messages', err)
    })
  }


  sendMessage(text) {
    this.currentUser.sendMessage({
        text,
        roomId:this.state.roomId
    })
}


createRoom(name) {
  this.currentUser.createRoom({
      name
  })
  .then(room => this.subscribeToRoom(room.id))
  .catch(err => console.log('error with createRoom: ', err))
}


  render() {
    return (

      <div className="app">
        <RoomList
        roomId ={this.state.roomId}
         subscribeToRoom={this.subscribeToRoom}  
         rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
          />
        <MessageList 
        roomId ={this.state.roomId}
        messages={this.state.messages}
         />
        <SendMessageForm
        disabled={!this.state.roomId}
         sendMessage={this.sendMessage} 
         />
        <NewRoomForm createRoom={this.createRoom} />      </div>
    );
  }
}

export default App