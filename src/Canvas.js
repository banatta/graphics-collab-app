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
      initialImage: null,
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

      this.socket.emit('edit_image', command);
      return false;
    }

    this.imageResetHandler = (e) => {
      e.preventDefault();
      console.log(this.initialImage)
      this.setState({selectedImage: this.state.initialImage})
      this.fileUploadHandler(e)
      return false
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
      <div className="canvas-component col-md-6">
          <h2>Canvas</h2>
          <canvas id="canvas" alt="canvas" width="500" height="500" ></canvas>
          <p>Upload an image to begin</p>

          <form onSubmit={(e) => this.fileUploadHandler(e)}>
            <div className="btn-group">
              <div className="form-group">
                <label htmlFor="image-upload" className="btn btn-secondary">Select File</label>
                <input id="image-upload" type="file" accept="image/*" onChange={(e) => this.setState({selectedImage: e.target.files[0], initialImage: e.target.files[0]})} hidden />
              </div>
              <input type='submit' className="btn btn-primary" value="Upload" />
            </div>
          </form>

          <span>Transform</span>
          <div className="btn-group d-flex">
            <button className="btn btn-outline-primary w-100" onClick={(e) => this.imageEditHandler(e, 'blur')}> Blur </button>
            <button className="btn btn-outline-primary w-100" onClick={(e) => this.imageEditHandler(e, 'implode')}> Implode </button>
          </div>

          <span>Flip</span>
          <div className="btn-group d-flex">
            <button className="btn btn-outline-primary w-100" onClick={(e) => this.imageEditHandler(e, 'flip')}> Vertical </button>
            <button className="btn btn-outline-primary w-100" onClick={(e) => this.imageEditHandler(e, 'flop')}> Horizontal </button>
          </div>

          <span>Filter</span>
          <div className="btn-group d-flex">
            <button className="btn btn-outline-primary w-100" onClick={(e) => this.imageEditHandler(e, 'sepia')}> Sepia </button>
            <button className="btn btn-outline-primary w-100" onClick={(e) => this.imageEditHandler(e, 'monochrome')}> Monochrome </button>
            <button className="btn btn-outline-primary w-100" onClick={(e) => this.imageEditHandler(e, 'negate')}> Negate </button>
          </div>
          <br />
          <div>
            <button className="btn btn-danger" onClick={(e) => this.imageResetHandler(e)}>Reset Image</button>
            <button className="btn btn-success" onClick={(e) => this.fileSaveHandler(e)}>Save to Gallery</button>
          </div>
      </div>
    );
  }
}

export default Canvas;