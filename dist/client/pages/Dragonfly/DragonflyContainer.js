import { compose, mapProps } from 'recompose';
import Dragonfly from './Dragonfly';

export default compose(
  mapProps(ownProps => {
    return {
      ...ownProps,
      testPlugin: (plugin, details) => {
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
              });
          } else {
            res({});
          }
        });
      },
      plugins: ['cryptoPoller', 'customEntry', 'gpioPoller', 'BMP180Poller', 'DHT11Poller'],
    };
  }),
)(Dragonfly);
