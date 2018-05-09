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

    //upload the file to the backend
    this.fileUploadHandler = e => {
      e.preventDefault();
      //error check this
      this.socket.emit('upload_new_image', {
        image: this.state.selectedImage
      });
      return false;
    }

    this.fileSaveHandler = () => {
      return false;
      //emit save and upload to s3
    }

    //This fires whenever the image is changed/edited
    this.socket.on('canvas_image_changed', function(data){
      console.log(data);
      //updateCanvasState();
    });

    // const updateCanvasState = (data) => {
    //   this.setState({
    //     canvasImage: "./public/canvas.jpg?"
    //   });
    // }

  }

  fileUpload(){

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

       
        <form className="input" onSubmit={(e) => this.fileUploadHandler(e)}>
            <input type="file" onChange={(e) => this.setState({selectedImage: e.target.files[0]})}/>
            <input type='submit' value="Upload" />
        </form>

      </div>
    );
  }
}

export default Canvas;