import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Gallery from 'react-grid-gallery';

class App extends Component {

  constructor(props){
    super(props);
    this.myref = React.createRef();
    this.state = {
      galleryImages: [],
      loading: false,
      page: 0,
      prevY: 0,
    }
  }

  componentDidMount(){
    this.getImages(this.state.page);
    this.state.page++;
    const options = {
      root: null,
      threshold: 1.0,
    }

    this.observer = new IntersectionObserver(
      this.handleObserver.bind(this), 
      options
    );

    //Observe the `loadingRef`
    this.observer.observe(this.loadingRef);
  }

  handleObserver = (entities, options) => {
    const y = entities[0].boundingClientRect.y;
    if (this.state.prevY > y) {
      let page = this.state.page+1;
      this.getImages(page);
      this.setState({ page: page });
    }
    this.setState({ prevY: y });
  }

  getImages(page){
    this.setState({ loading: true});

    //http request
    var url = `https://api.unsplash.com/photos/curated?client_id=871acdafa9dfd095742022097a68696df5d2c17a9fb80f5a14d1482099742697&page=${page}&per_page=30`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
      let tempImages = [];
      data.forEach(image => {
        tempImages.push({
          "src": image.urls.regular,
          "thumbnail": image.urls.thumb,
          "alt": image.alt_description,
          "caption": (image.description ? image.description : "") + (image.alt_description ?  " | " + image.alt_description : "" ),
          "thumbnailWidth": image.width/10,
          "thumbnailHeight": image.height/10,
        })
      });
      this.setState({
        galleryImages: [... this.state.galleryImages, ...tempImages]
      });
      this.setState({ loading: true});
    })
    .catch(error => console.error(error));
  }

  render() {
    const loadingCSS = {
      height: '50px',
      margin: '80px 0px',
      padding: '30px',
      clear: 'both'
    };
    const loadingTextCSS = { display: this.state.loading ? 'block' : 'none' };
    return (
      <div className="App">        
        <h3>
            Image Gallery
        </h3>
        <div style={{ minHeight: '800px' }}>
          <ul>
            <Gallery images={this.state.galleryImages}></Gallery>
          </ul>
        </div>
        <div
          ref={loadingRef => (this.loadingRef = loadingRef)}
          style={loadingCSS}
        >
          <span style={loadingTextCSS}>Loading...</span>
        </div>
        
      </div>
    );
  }
}

export default App;
