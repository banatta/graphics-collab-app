import React from 'react';
import io from "socket.io-client";
import './App.css';

//Canvas where any user can upload an image
//They can use the controls to edit the image
//They can save the image to the gallery through s3
class Canvas extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedImage: null,
      canvasImage: null
    };

    this.socket = io('localhost:8080');

    this.fileSelectedHandler = event => {
      this.setState({
        selectedImage: event.target.files[0]
      });
    }

    this.fileUploadHandler = event => {
      //error check this
      this.socket.emit('upload_new_image', {
        image: this.state.selectedImage
      });
    }

    this.fileSaveHandler = () => {
      //emit save and upload to s3
    }

    //This fires whenever the image is changed/edited
    this.socket.on('canvas_image_changed', function(data){
      updateCanvasState();
    });

    const updateCanvasState = (data) => {
      this.setState({
        canvasImage: "./public/canvas.jpg?" + new Date().getTime()
      });
    }

  }

  componentDidMount() {
    //request canvas state
  }

  render() {
    return (
      <div className="canvas">
        <h3>Canvas</h3>
        <img src={this.state.canvasImage} alt="canvas" />
        <p> Upload an image to begin </p>

        <input type="file" onChange={this.fileSelectedHandler}/>
        <button onClick={this.fileUploadHandler}> Upload </button>
        <button onClick={this.fileSaveHandler}> Save To Gallery </button>
      </div>
    );
  }
}

export default Canvas;