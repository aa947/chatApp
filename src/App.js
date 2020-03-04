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
        joinedRooms :[]
    }

    this.sendMessage = this.sendMessage.bind(this);
} 


  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: process.env.REACT_APP_INCTANSE_LOCATOR,
      userId: 'ahmad',
      tokenProvider: new Chatkit.TokenProvider({
        url: process.env.REACT_APP_URL,
      })
    })

    // chatManager.connect()
    // .then(currentUser => {
    //   console.log('connected succesfully ...')
    //     currentUser.subscribeToRoomMultipart({
    //         roomId: 'e269bb36-f3a0-450c-8635-397d00988c92',
    //         messageLimit: 10,
    //         hooks: {
    //           onMultipartMessage: message => {
    //                 console.log('message.text: ', message.text);
    //             }
    //         }
    //     })
    // })

    chatManager.connect()
      .then(currentUser => {
        // console.log('Successful connection', currentUser)

        /*
        * Assign Current User To ba accesible In the class outside of this promise
        */
        this.currentUser = currentUser;

        /*
        * Fetch All Existed Rooms
        */
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

        /*
        * Fetch All Existed Messages and Listen to New Ones
        */
       this.currentUser.subscribeToRoomMultipart({
          roomId: 'e269bb36-f3a0-450c-8635-397d00988c92',
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
        .catch(err => {
          console.log('Error on Fetching Messages', err)
        })
  

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


  sendMessage(text) {
    this.currentUser.sendMessage({
        text,
        roomId:'e269bb36-f3a0-450c-8635-397d00988c92'
    })
}

  render() {
    return (

      <div className="app">
        <RoomList rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} />
        <MessageList messages={this.state.messages} />
        <SendMessageForm sendMessage={this.sendMessage} />
        <NewRoomForm />
      </div>
    );
  }
}

export default App