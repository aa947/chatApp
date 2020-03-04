import React from 'react'

const DUMMY_DATA = [
    {
        senderId: 'perborgen',
        text: 'Hey, how is it going?'
    },
    {
        senderId: 'janedoe',
        text: 'Great! How about you?'
    },
    {
        senderId: 'perborgen',
        text: 'Good to hear! I am great as well'
    }
]


class MessageList extends React.Component {
    render() {
        return (
            <div className="message-list">
                <div className="help-text">MessageList</div>
            </div>
        )
    }
}

export default MessageList