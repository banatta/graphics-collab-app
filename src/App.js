import React, { Component } from 'react';
import './App.css';

import Chat from './Chat.js';
import Gallery from './Gallery.js';
import Canvas from './Canvas.js';

class App extends Component {
  render() {
    return (
      <div className="App">
      <div className="container">
        <div className="text-center">
          <h1>Graphics Collaborator</h1>
        </div>
        <div className="row">
          <Canvas />
          <Chat />
          <Gallery />
        </div>
      </div>
      </div>
    );
  }
}

export default App;
