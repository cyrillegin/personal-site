import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactGA from 'react-ga';
import { NavBar } from '../components/NavBar/NavBar';
import { DragonflyPage, VisualizationPage, BoatPage } from '../pages';

ReactGA.initialize('UA-107911028-1');

export const App = () => {
  const fireTracking = () => {
    ReactGA.pageview(window.location.hash);
  };

  useEffect(() => {
    // hide the preloader.
    document.querySelector('.loader').style.visibility = 'hidden';
  }, []);

  const router = createBrowserRouter([
    {
      path: '/dragonfly',
      element: <DragonflyPage />,
    },
    {
      path: '/visualization',
      element: <VisualizationPage />,
    },
    {
      path: '/',
      element: <BoatPage />,
    },
  ]);

  return (
    <div>
      <NavBar />
      <RouterProvider router={router} />
    </div>
  );
};
