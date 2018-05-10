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

    this.fileSaveHandler = e => {
      e.preventDefault();
      //error check this
      this.socket.emit('save_canvas', {
        image: this.state.selectedImage
      });
      return false;
      //emit save and upload to s3
    }

    this.imageEditHandler = (e, command) => {
      e.preventDefault();

      console.log(command);
      this.socket.emit('edit_image', command);
      return false;
    }

    //clear the canvas, then redraw from the buffer
    const updateCanvas = data => {
      var canvas = document.getElementById('canvas')
      var ctx = canvas.getContext('2d');
      if(data.image){
        var img = new Image();
        img.onload = function() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = 'data:image/jpeg;base64,' + data.buffer;
      }
    }


    //This fires whenever the image is changed/edited
    this.socket.on('send_canvas_buffer', function(data){
      updateCanvas(data);
    });
  }

  fetchCanvas(){
    this.socket.emit("fetch_canvas", '');
  }
  componentDidMount() {
    this.fetchCanvas();
  }

  render() {
    return (
      <div class="canvas-component">
        <h3>Canvas</h3>
        <canvas id="canvas" alt="canvas" width="500" height="500" ></canvas>
        <p> Upload an image to begin </p>

       
        <form className="input" onSubmit={(e) => this.fileUploadHandler(e)}>
            <input type="file" onChange={(e) => this.setState({selectedImage: e.target.files[0]})}/>
            <input type='submit' value="Upload" />
        </form>

        <button type='button' onClick={(e) => this.fileSaveHandler(e)}> Save to Gallery </button>

        <div class="gmControls">
          <button type='button' onClick={(e) => this.imageEditHandler(e, 'blur')}> Blur </button>
          <button type='button' onClick={(e) => this.imageEditHandler(e, 'implode')}> Implode </button>
          <button type='button' onClick={(e) => this.imageEditHandler(e, 'sepia')}> Sepia </button>
          <button type='button' onClick={(e) => this.imageEditHandler(e, 'flip')}> Flip </button>
          <button type='button' onClick={(e) => this.imageEditHandler(e, 'flop')}> Flop </button>
          <button type='button' onClick={(e) => this.imageEditHandler(e, 'monochrome')}> Monochrome </button>
          <button type='button' onClick={(e) => this.imageEditHandler(e, 'negate')}> Negate </button>
        </div>

      </div>
    );
  }
}

export default Canvas;