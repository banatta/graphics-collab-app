import React, { Component } from 'react';
import './App.css';

import Chat from './Chat.js';
import Gallery from './Gallery.js';
import Canvas from './Canvas.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h2> Graphics Collaborator </h2>
        <Canvas />
        <Chat />
        <Gallery />
      </div>
    );
  }
}

export default App;
