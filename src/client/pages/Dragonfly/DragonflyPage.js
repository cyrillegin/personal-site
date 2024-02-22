import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';

const testPlugin = (plugin, details) => {
  return new Promise((res, rej) => {
    if (plugin === 'cryptoPoller') {
      fetch('/crypto', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plugin: plugin, details: details }),
      })
        .then(response => response.json())
        .then(data => {
          res(data);
        }).catch(e => rej(e));
    } else {
      res({});
    }
  });
};

const useStyles = createUseStyles(() => ({
  root: {
    width: screen.width > 850 ? '80%' : '90%',
    margin: 'auto',
  },
  descriptionContainer: {
    textAlign: 'justified',
    lineHeight: '1.6em',
  },

  image: {
    width: '53%',
    float: 'right',
    margin: '24px 0 0 14px',
  },
  demoContainer: {
    flexGrow: 1,
    display: 'flex',
  },
  fullPaper: {
    width: '100%',
    padding: '16px',
    transition: '500ms',
  },
  leftPaper: {
    width: '33%',
    padding: '16px',
    transition: '500ms',
  },
  rightPaper: {
    width: '100%',
    marginLeft: '16px',
    padding: '16px',
    transition: '500ms',
  },
  textField: {
    width: '100%',
  },
  selectedPlugin: {
    background: '#dcffdc',
  },
}));

const plugins = ['cryptoPoller', 'customEntry', 'gpioPoller', 'BMP180Poller', 'DHT11Poller'];

export const DragonflyPage = () => {
  const classes = useStyles();

  const [state, setState] = useState({
    loading: true,
    plugins: null,
    dialogIsOpen: false,
    dialogMessage: '',
    dialogTitle: '',
    selectedPlugin: '',
    pollRate: '',
    name: '',
    description: '',
    coefficients: '',
    station: '',
    poller: '',
    pin: '',
    units: '',
    endpoint: '',
    meta: '',
  });

  // const handlePluginSelect = name => {
  //   setState({
  //     selectedPlugin: name,
  //     testResult: {},
  //   });
  // };

  const handleChange = name => event => {
    setState({
      [name]: event.target.value,
      testResult: {},
    });
  };

  const testSensor = () => {
    testPlugin(this.state.selectedPlugin, {
      name: this.state.name,
      description: this.state.description,
      coefficients: this.state.coefficients,
      station: this.state.station,
      pollRate: this.state.pollRate,
      pin: this.state.pin,
      units: this.state.units,
      endpoint: this.state.endpoint,
      meta: this.state.meta,
    })
      .then(data => {
        setState({
          dialogIsOpen: true,
          dialogMessage: data,
          dialogTitle: 'Test Result',
        });
      });
  };

  // const closeDialog = () => {
  //   setState({
  //     dialogIsOpen: false,
  //   });
  // };

  // const pollerIcon = icon => {
  //   switch (icon) {
  //     case 'cryptoPoller':
  //       return <MonetizationOnIcon />;
  //     case 'gpioPoller':
  //       return <ACUnitIcon />;
  //     default:
  //       return <ShowChartIcon />;
  //   }
  // };

  const fullscreen = () => {
    const image = document.getElementById('dragonfly-image');
    if (image.requestFullscreen) {
      image.requestFullscreen();
    } else if (image.webkitRequestFullscreen) {
      image.webkitRequestFullscreen();
    } else if (image.mozRequestFullScreen) {
      image.mozRequestFullScreen();
    } else if (image.msRequestFullscreen) {
      image.msRequestFullscreen();
    } else {
      console.info('Fullscreen API is not supported.');
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.demoContainer}>
        {/* <Dialog
          open={state.dialogIsOpen}
          onClose={closeDialog}
          onClick={event => {
            event.nativeEvent.stopImmediatePropagation();
          }}
        >
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>{state.dialogMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="primary">
              Okay
            </Button>
          </DialogActions>
        </Dialog> */}

        <div
          className={state.selectedPlugin === '' ? classes.fullPaper : classes.leftPaper}
          elevation={4}
        >
          <div >
            Plugins
          </div>

          <ul  className={classes.pluginsList}>
            {plugins.map((plugin, index) => {
              return (
                <li
                  className={plugin === state.selectedPlugin ? classes.selectedPlugin : null}
                  key={index}
                  
                >
                  <button onClick={() => {
                    this.handlePluginSelect(plugin);
                  }}>

                 
                    {/* <ListItemIcon>{pollerIcon(plugin)}</ListItemIcon> */}
                    {/* <ListItemText primary={plugin} /> */}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        {state.selectedPlugin !== '' && (
          <div className={classes.rightPaper}>
            <div className={classes.title}>
              Details
            </div>
            <form className={classes.container} noValidate autoComplete="off">
              <input
                id="name"
                label="Name"
                onChange={handleChange('name')}
                className={classes.textField}
                value={state.name}
             
              />
              <input
                id="description"
                label="Description"
                onChange={handleChange('description')}
                className={classes.textField}
                value={state.description}
             
              />
              <input
                id="coefficients"
                label="Coefficients"
                onChange={handleChange('coefficients')}
                className={classes.textField}
                value={state.coefficients}
         
              />
              <input
                id="station"
                label="Station"
                onChange={handleChange('station')}
                className={classes.textField}
                value={state.station}
        
              />
              <input
                id="pollRate"
                label="Poll Rate"
                onChange={handleChange('pollRate')}
                className={classes.textField}
                value={state.pollRate}
            
              />
              <input
                id="pin"
                label="Pin"
                onChange={handleChange('pin')}
                className={classes.textField}
                value={state.pin}
            
              />
              <input
                id="units"
                label="Units"
                onChange={handleChange('units')}
                className={classes.textField}
                value={state.units}
               
              />
              <input
                id="endpoint"
                label={'Endpoint'}
                onChange={handleChange('endpoint')}
                className={classes.textField}
                value={state.endpoint}
                
              />
              <input
                id="meta"
                label={'Meta'}
                onChange={handleChange('meta')}
                className={classes.textField}
                value={state.meta}
              
              />
              <button className={classes.button} onClick={testSensor}>
                Test Sensor
              </button>
              <button disabled={true} className={classes.button}>
                Submit Sensor
              </button>
            </form>
          </div>
        )}
      </div>

      <img
        className={classes.image}
        src="/screenshots/home.webp"
        id="dragonfly-image"
        alt={'Image of the home screen of Dragonfly'}
        onClick={fullscreen}
      />
      <p className={classes.descriptionContainer}>
        Dragonfly is all purpose sensor poller designed to be an easy interface for using raspberry
        pis. You can see in the picture on the right an example of what dragonfly would look like
        with multiple sensors hooked up. Upon hooking up a sensor to a raspberry pi, the user can
        then link a poller to it and add polling details like poll rate, coefficients, a station
        name and description. If the user has many pis running at the same time, multiple dragonfly
        instances can be linked to each other or forward all of their data to a central server. Once
        a sensor has been hooked up, actions can then be added to to the poller like sending an
        email or slack or turning on another sensor
        <br />
        The example above allows you to see some of the plugins available. The only one functioning
        is the cryptopoller. In the metadata field, you can add the name of your favorite
        cryptocurrency and it will respond with its current price in US dollars.
      </p>
    </div>
  );
};
