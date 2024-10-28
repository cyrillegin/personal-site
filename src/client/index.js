import { ThreeManager } from './ThreeManager';

const canvas = document.createElement('div');
canvas.id = 'canvas';
document.body.appendChild(canvas);

ThreeManager.init(canvas);
document.querySelector('.loader').style.visibility = 'hidden';

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
