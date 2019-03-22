import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Unsplash from 'unsplash-js';

class App extends Component {

  constructor(props){
    super(props);
    this.myref = React.createRef();
    this.state = {
      images: [],
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

    //Observ the `loadingRef`
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
    //http requets

    var url = `https://api.unsplash.com/photos/curated?client_id=871acdafa9dfd095742022097a68696df5d2c17a9fb80f5a14d1482099742697&page=${page}`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
      this.setState({
        images: [... this.state.images, ...data]
      });
      this.setState({ loading: true});
    })
    .catch(error => console.error(error));
  }

  render() {
    const loadingCSS = {
      height: '100px',
      margin: '30px'
    };
    const loadingTextCSS = { display: this.state.loading ? 'block' : 'none' };
    return (
      <div className="App">        
        <h3>
            Image Gallery
        </h3>
        <div style={{ minHeight: '800px' }}>
          <ul>
            {this.state.images.map(image =>
              <img 
                key={image.id}
                src={image.urls.regular} 
                alt={image.description} 
              />
            )}
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
