import { compose, mapProps } from 'recompose';
import Boat from './Boat';

export default compose(
  mapProps(ownProps => {
    return {
      ...ownProps,
      getBoat: model => {
        return fetch('/models/testBoat.json');
      },
    };
  }),
)(Boat);
