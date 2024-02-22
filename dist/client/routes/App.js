import React, { Component, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ReactGA from 'react-ga';
import NavBar from '../components/NavBar/NavBar';

const BoatContainer = lazy(() => import('./../pages/Boat/BoatContainer'));
const DragonflyContainer = lazy(() => import('./../pages/Dragonfly/DragonflyContainer'));
const VisualizationContainer = lazy(() =>
  import('./../pages/Visualization/VisualizationContainer'),
);

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
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route exact path="/dragonfly" component={DragonflyContainer} />
              <Route exact path="/visualization" component={VisualizationContainer} />
              <Route component={BoatContainer} />
            </Switch>
          </Suspense>
        </div>
      </Router>
    );
  }
}
