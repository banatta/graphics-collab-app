import React from 'react';
import io from "socket.io-client";
import ReactDOM from 'react-dom';
import './App.css';

import Message from './Message.js';

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chatMsgs:[{
        username: "GraphicsBot",
        message: <p>Welcome to Graphics Collaborator!</p>,
      }]
    };

    this.socket = io('localhost:8080');

    //Chat Message Submit
    this.submitMessage = e => {
      e.preventDefault();

      this.socket.emit('send_message', {
        username: this.state.username,
        message: this.state.message
      });

      this.setState({message: ''});
      //make username readonly
    }

    this.socket.on('receive_message', function(data){
      addMessage(data);
    });

    const addMessage = data => {
      this.setState({chatMsgs: [...this.state.chatMsgs, data]});
    };

  }

  componentDidMount() {
      this.scrollToBot();
  }

  componentDidUpdate() {
      this.scrollToBot();
  }

  scrollToBot() {
      ReactDOM.findDOMNode(this.refs.chatMsgs).scrollTop = ReactDOM.findDOMNode(this.refs.chatMsgs).scrollHeight;
  }

  render() {
    //javascript
    const username = "anonymous";
    const { chatMsgs } = this.state;

    return (
      <div className="chat">
          <h3>Chat</h3>
          <ul className="chatMsgs" ref="chatMsgs">
              {
                  chatMsgs.map((chat) => 
                      <Message chat={chat} user={username} />
                  )
              }
          </ul>
          <form className="input" onSubmit={(e) => this.submitMessage(e)}>
              <input id="username" placeholder="Username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} required="required"/>
              <input id="message" autocomplete="off" placeholder="Type your message!" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})} required="required"/>
              <input type="submit" value="Submit" />
          </form>
      </div>
    );
  }
}

export default Chat;