import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createUseStyles } from 'react-jss';
import { ThreeManager } from './ThreeManager';

const getBoat = model => {
  return fetch('/models/testBoat.json');
};

const baseButton = {
  position: 'absolute',
  width: '50px',
  height: '50px',
  border: '1px solid black',
  lineHeight: '50px',
  fontSize: '20px',
  fontWeight: 'bold',
  color: 'white',
  textAlign: 'center',
  '&:hover': {
    background: 'rgba(0, 197, 0, 1)',
  },
};

const useStyles = createUseStyles(() => ({
  canvas: {
    height: `${screen.height > 600 ? '600' : screen.height - 20}px`,
    width: screen.height > 600 ? '70%' : '90%',
    background: '#e0e0e0',
    margin: '16px auto',
  },
  cube: {
    width: '50px',
    height: '50px',
    position: 'absolute',
    top: '176px',
    right: screen.height > 600 ? 'calc(15% + 33px)' : 'calc(33px + 5%)',
    transformStyle: 'preserve-3d',
    transform: 'rotateX(55deg) rotateY(0deg) rotateZ(45deg)',
    transition: 'transform 1s',
  },
  cameraTop: {
    ...baseButton,
    transform: 'rotateY(0deg) translateZ(25px)',
    background: 'rgba(172, 172, 172, 0.7)',
  },
  cameraSide: {
    ...baseButton,
    transform: 'rotateY(90deg) translateZ(25px)',
    background: 'rgba(76, 76, 76, 0.7)',
  },
  cameraFront: {
    ...baseButton,
    transform: 'rotateX(-90deg) translateZ(25px)',
    background: 'rgba(0, 0, 0, 0.7)',
  },
  cameraPerspective: {
    position: 'absolute',
    border: '1px solid black',
    right: screen.height > 600 ? 'calc(15% + 38px)' : 'calc(38px + 5%)',
    color: 'white',
    top: '254px',
    fontSize: '21px',
    fontWeight: 'bold',
    padding: '3px',
    textAlign: 'center',
    background: 'rgba(172, 172, 172, 0.7)',
    '&:hover': {
      background: 'rgba(0, 197, 0, 1)',
    },
  },
  togglesContainer: {
    position: 'absolute',
    top: '160px',
    left: screen.height > 600 ? 'calc(15% + 20px)' : 'calc(5% + 20px)',
    width: '20%',
  },
  description: {
    width: screen.height > 600 ? '70%' : 'calc(90% - 24px)',
    padding: '12px',
    margin: '16px auto',
  },
}));

export const BoatPage = props => {
  // static propTypes = {
  //   classes: PropTypes.object.isRequired,
  //   getBoat: PropTypes.func.isRequired,
  // };

  const classes = useStyles();
  const [state, setState] = useState({
    loaded: false,
    shaded: true,
    wireframe: true,
    verticies: false,
  });

  const handleDisplayChange = e => {
    if (state.loaded) {
      this.setState({
        [e.target.value]: !state[e.target.value],
      });
      if (e.target.value === 'shaded') {
        ThreeManager.meshController.showMesh(!state[e.target.value]);
      }
      if (e.target.value === 'verticies') {
        ThreeManager.app.displayVerticies = !ThreeManager.app.displayVerticies;

        Object.keys(state.boat).forEach(key => {
          if (key === 'width' || key === 'height' || key === 'length' || key === 'frames') {
            return;
          }
          ThreeManager.app = ThreeManager.curveController.deleteCurve(ThreeManager.app, { key });
        });
        ThreeManager.curveController.initCurves(ThreeManager.app, state.boat);
      }
      if (e.target.value === 'wireframe') {
        ThreeManager.app.displayWireFrame = !ThreeManager.app.displayWireFrame;
        ThreeManager.curveController.showCurves(!ThreeManager.app.displayWireFrame);
      }
    }
  };

  return (
    <div>
      <div id={'canvas'} className={classes.canvas} />

      <div className={classes.cube}>
        <div className={classes.cameraTop} id={'camera-top-button'}>
          Top
        </div>

        <div className={classes.cameraSide} id={'camera-side-button'}>
          Side
        </div>

        <div className={classes.cameraFront} id={'camera-front-button'}>
          Front
        </div>
      </div>
      <div className={classes.cameraPerspective} id={'camera-45-button'}>
        45°
      </div>

      <div className={classes.togglesContainer}>
        {/* <FormControlLabel
          control={<Switch checked={state.shaded} onChange={handleDisplayChange} value="shaded" />}
          label="Toggle Shaded"
        />
        <FormControlLabel
          control={
            <Switch checked={state.verticies} onChange={handleDisplayChange} value="verticies" />
          }
          label="Toggle Verticies"
        />
        <FormControlLabel
          control={
            <Switch checked={state.wireframe} onChange={handleDisplayChange} value="wireframe" />
          }
          label="Toggle Wireframe"
        /> */}
      </div>

      <div className={classes.description}>
        This was a project done for my senior project at New Mexico State University. The goal was
        to be able to construct a boat in 3D and output the blueprints so that an amateur boat maker
        could build it. The user would also be able to save and load their projects via json files
        as well as be able to export in obj or stl formats for 3D printing.
        <br />
        This demo allows you to view the demo boat and trigger some different rendering methods. You
        can also pan, zoom, and orbit around the boat.
      </div>
    </div>
  );
};
