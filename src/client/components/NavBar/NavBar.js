import React, { useEffect } from 'react';
import { SocialIcon } from 'react-social-icons';
import { createUseStyles } from 'react-jss';
import { Link, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

const useStyles = createUseStyles(() => ({
  root: {
    width: '100%',
    top: 0,
  },
  title: {
    textAlign: 'center',
  },
  menuGroup: {
    textAlign: 'center',
    marginBottom: '20px',
    marginTop: '20px',
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
  icons: {
    marginTop: '20px',
    width: '100%',
    justifyContent: 'space-between',
    textAlign: 'center',
  },
  // icon: {
  //   marginLeft: '6px',
  //   marginRight: '6px',
  // },
}));

export const NavBar = () => {
  const classes = useStyles();
  const location = useLocation();

  let currentPage = location.pathname;
  if (currentPage === '/') {
    currentPage = '/boat';
  }

  useEffect(() => {
    ReactGA.pageview(window.location.hash);
  }, [location]);

  return (
    <div>
      <div color="inherit" className={classes.title}>
        Cyrille Gindreau
      </div>
      <div className={classes.icons}>
        <SocialIcon
          style={{ height: 25, width: 25, marginLeft: '6px', marginRight: '6px' }}
          url="https://www.facebook.com/cyrille.gindreau"
        />
        <SocialIcon
          style={{ height: 25, width: 25, marginLeft: '6px', marginRight: '6px' }}
          url="https://www.instagram.com/cyrillegin/"
        />
        <SocialIcon
          style={{ height: 25, width: 25, marginLeft: '6px', marginRight: '6px' }}
          url="https://github.com/cyrillegin"
        />
        <SocialIcon
          style={{ height: 25, width: 25, marginLeft: '6px', marginRight: '6px' }}
          url="https://twitter.com/cyrillegin"
        />
        <SocialIcon
          style={{ height: 25, width: 25, marginLeft: '6px', marginRight: '6px' }}
          url="https://www.linkedin.com/in/cyrille-gindreau-77008417/"
        />
      </div>
      <div className={classes.menuGroup}>
        <Link
          to="/boat"
          className={currentPage === '/boat' ? classes.selectedMenuItem : classes.menuItem}
        >
          Boat Builder
        </Link>
        <Link
          to="/visualization"
          className={currentPage === '/visualization' ? classes.selectedMenuItem : classes.menuItem}
        >
          Data Visualization
        </Link>
        <Link
          to="/dragonfly"
          className={currentPage === '/dragonfly' ? classes.selectedMenuItem : classes.menuItem}
        >
          Dragonfly
        </Link>
      </div>
    </div>
  );
};

NavBar.propTypes = {};
