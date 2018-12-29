import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ReactGA from 'react-ga';
import NavBar from '../components/navbar/NavBar';
import BoatContainer from './../pages/Boat/BoatContainer';
import DragonflyContainer from './../pages/Dragonfly/DragonflyContainer';
import VisualizationContainer from './../pages/Visualization/VisualizationContainer';

ReactGA.initialize('UA-107911028-1');

export default class App extends Component {
  static propTypes = {};

  fireTracking() {
    ReactGA.pageview(window.location.hash);
  }

  componentDidMount() {
    // hide the preloader.
    document.querySelector('.loader').style.visibility = 'hidden';
  }

  render() {
    return (
      <Router onUpdate={this.fireTracking}>
        <div>
          <NavBar />
          <Switch>
            <Route exact path="/dragonfly" component={DragonflyContainer} />
            <Route exact path="/visualization" component={VisualizationContainer} />
            <Route component={BoatContainer} />
          </Switch>
        </div>
      </Router>
    );
  }
}
