import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactGA from 'react-ga';
import { NavBar } from '../components/NavBar/NavBar';
import { DragonflyPage, VisualizationPage, BoatPage } from '../pages';

ReactGA.initialize('UA-107911028-1');

export const App = () => {
 

  useEffect(() => {
    // hide the preloader.
    document.querySelector('.loader').style.visibility = 'hidden';
  }, []);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/dragonfly" element={<DragonflyPage />} />
        <Route path="/visualization" element={<VisualizationPage />} />
        <Route exact path="/" element={<BoatPage />} />
      </Routes>
    </BrowserRouter>
  );
};
