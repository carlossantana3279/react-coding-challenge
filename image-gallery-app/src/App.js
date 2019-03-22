import React, { Component } from 'react';
import './App.css';
import Gallery from 'react-grid-gallery';

class App extends Component {

  constructor(props){
    super(props);
    // The State Object Attributes 
    this.state = {
      galleryImages: [],
      loading: false,
      page: 0,
    }
  }

  componentDidMount(){
    // load some images initially
    this.getImages(this.state.page);    
    this.setState({ page: this.state.page+1});      // page++
    
    // observer options
    const options = {
      root: null,         //page as root
      threshold: 1.0,     //only observe when the hilw object is visible
    }

    this.observer = new IntersectionObserver(
      this.handleObserver.bind(this), 
      options
    );

    // set the target. Observe `loadingRef`
    this.observer.observe(this.loadingRef);
  }

  // callback for observer
  handleObserver = (entities, options) => {
      // increase the page
      let page = this.state.page+1;
      //get images for the next page
      this.getImages(page);
      this.setState({ page: page });
  }

  getImages(page){
    this.setState({ loading: true});

    //http request
    var url = `https://api.unsplash.com/photos/curated?client_id=871acdafa9dfd095742022097a68696df5d2c17a9fb80f5a14d1482099742697&page=${page}&per_page=30`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
      //turn each image opbect returned by the unsplash API to the proper format
      let tempImages = [];
      data.forEach(image => {
        tempImages.push({
          "src": image.urls.regular,
          "thumbnail": image.urls.thumb,
          "alt": image.alt_description,
          // additional information in lightbox. Smarter logic should be place here
          "caption": (image.description ? image.description : "") + (image.alt_description ?  " | " + image.alt_description : "" ),
          "thumbnailWidth": image.width/10,
          "thumbnailHeight": image.height/10,
        })
      });
      // update image gallery
      this.setState({ galleryImages: [...this.state.galleryImages, ...tempImages] });
      this.setState({ loading: true});
    })
    .catch(error => console.error(error));
  }

  render() {
    // loading icon styles
    const loadingCSS = {
      height: '50px',
      margin: '80px 0px',
      padding: '0px',
      clear: 'both'
    };
    // Used to show or hide the loading icon
    const loadingTextCSS = { display: this.state.loading ? 'block' : 'none' };
    return (
      <div className="App">
        {/* The Website Header */}
        <h3>
            Carlos' Image Gallery
        </h3>
        {/* The Grid of Images */}
        <div style={{ minHeight: '800px',  padding: '0', margin: '0'}}>
          <ul>
            <Gallery images={this.state.galleryImages}></Gallery>
          </ul>
        </div>
        {/* The loading Icon */}
        <div ref={loadingRef => (this.loadingRef = loadingRef)} style={loadingCSS}>
          <span style={loadingTextCSS}>Loading...</span>
        </div>        
      </div>
    );
  }
}

export default App;
