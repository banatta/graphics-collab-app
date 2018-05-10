import React from 'react';
import ReactDOM from 'react-dom';
import io from "socket.io-client";
import './App.css';

//Gallery Component that pulls all images from S3 Bucket
class Gallery extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gallery:[]
    };

    this.socket = io('localhost:8080');

    //Pull all image urls from S3
    //Refresh State on Button press
    this.refreshGalleryHandler = e => {
      this.requestGallery();
    }

    //Update the state when the server emits
    this.socket.on('return_gallery', function(data){
      updateGalleryState(data)
    });

    const updateGalleryState = data => {
      let urls = [];
      for (var key in data){
        urls.push(data[key]);
      }
      this.setState({gallery: urls});
    }
  }

  componentDidMount() {
    this.requestGallery()
    this.scrollToBot();
  }

  componentDidUpdate() {
    this.scrollToBot();
  }

  scrollToBot() {
    ReactDOM.findDOMNode(this.refs.gallery).scrollTop = ReactDOM.findDOMNode(this.refs.gallery).scrollHeight;
  }

  //Request images from s3 bucket
  requestGallery(){
    this.socket.emit('request_gallery', {});
  }

  render() {
    const { gallery } = this.state;

    return (
      <div className="gallery col-md-12 text-center">
          <h2>Gallery</h2>
          <button onClick = {(e) => this.refreshGalleryHandler(e)} >refresh</button>
          <ul className="gallery" ref="gallery">
              {
                  gallery.map((image, i) => 
                      <li key={i} className="gallery-item"><img src={image} alt="" /></li>
                  )
              }
          </ul>
      </div>
    );
  }
}

export default Gallery;