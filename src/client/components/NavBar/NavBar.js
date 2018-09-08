import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Link, withRouter} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';


const styles = {
  root: {
    width: '100%',
    top: 0,
  },
  title: {
    textAlign: 'center',
  },
  menuGroup: {
    textAlign: 'center',
    paddingBottom: '20px',
    paddingTop: '32px',
  },
  menuItem: {
    textDecoration: 'none',
    margin: '36px',
    color: '#000',
    fontSize: '1.4em',
  },
  selectedMenuItem: {
    textDecoration: 'none',
    margin: '36px',
    color: '#000',
    fontSize: '1.4em',
    borderBottom: '1px solid #07c300',
  },
};

export class NavBar extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  };

  state = {
    anchorEl: null,
  };

  handleMenu = event => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleClose = () => {
    this.setState({anchorEl: null});
  };

  render() {
    let currentPage = this.props.location.pathname;
    if (currentPage === '/') {
      currentPage = '/boat';
    }
    return (
      <div>
        <Typography variant="headline" color="inherit" className={this.props.classes.title}>
            Cyrille Gindreau
        </Typography>

        <div className={this.props.classes.menuGroup}>

          <Link to="/boat" className={currentPage === '/boat' ?
            this.props.classes.selectedMenuItem :
            this.props.classes.menuItem}>
              Boat Builder
          </Link>

          <Link to="/dragonfly" className={currentPage === '/dragonfly' ?
            this.props.classes.selectedMenuItem :
            this.props.classes.menuItem}>
              Dragonfly
          </Link>

          <Link to="/visualization" className={currentPage === '/visualization' ?
            this.props.classes.selectedMenuItem :
            this.props.classes.menuItem}>
              Data Visualization
          </Link>
        </div>

      </div>
    );
  }
}

export default withRouter(withStyles(styles)(NavBar));