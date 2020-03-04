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
        messages: []
    }
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
        console.log('Successful connection', currentUser)
        currentUser.subscribeToRoomMultipart({
          roomId: 'e269bb36-f3a0-450c-8635-397d00988c92',
          hooks: {
            onMessage: message => {
              console.log("received message", message);
              this.setState({
                messages: [...this.state.messages, message]
            })
            }
          },
          messageLimit: 10
        })

        currentUser.fetchMultipartMessages({
          roomId: 'e269bb36-f3a0-450c-8635-397d00988c92',
          //initialId: 42,
         // direction: 'older',
          limit: 10,
        })
          .then(messages => {
            // do something with the messages
            console.log('msgs ......', messages);
          })
          .catch(err => {
            console.log(`Error fetching messages: ${err}`)
          })
      })
      .catch(err => {
        console.log('Error on connection', err)
      })


  }

  render() {
    return (

      <div className="app">
        <RoomList />
        <MessageList messages={this.state.messages} />
        <SendMessageForm />
        <NewRoomForm />
      </div>
    );
  }
}

export default App