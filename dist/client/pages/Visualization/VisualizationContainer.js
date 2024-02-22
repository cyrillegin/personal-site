import { compose, mapProps } from 'recompose';
import Visualization from './Visualization';

export default compose(
  mapProps(ownProps => {
    return {
      ...ownProps,
    };
  }),
)(Visualization);
