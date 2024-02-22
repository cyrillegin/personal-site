import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './routes/App';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);

// window.addEventListener('load', () => {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker
//       .register('sw.js')
//       .then(() => {
//         console.log('Service worker registered');
//       })
//       .catch(e => {
//         console.log('Error registering service worker');
//         console.log(e);
//       });
//   }
// });
