
import { initScene,initCamera,initRenderer,initControls, setupEnvironement } from './modifiers';
import { initInteractions } from './modifiers/interactions';
import { ActionManager, AnimationManager, EVENTS, EventManager } from './managers';
import { Clock, PerspectiveCamera, Vector3 } from 'three'
import { degToRad } from "three/src/math/MathUtils.js";

export const STATE = {
  HOME: 'home',
  ABOUT: 'about',
  RESUME: 'resume',
  GRIDFINITY: 'gridfinity'
}

export const cameraMap = {
  [STATE.HOME]: new Vector3(0, degToRad(36), 0),
  [STATE.ABOUT]: new Vector3(degToRad(10), Math.PI / 2, 0),
}

class ThreeManager {

  state = STATE.HOME

  init(canvas) {
    this.scene = initScene();
    this.cameraGroup = initCamera();
    
    this.renderer = initRenderer(canvas)
    const freeRoam = false
    if(freeRoam) {
      this.cameraGroup = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
      this.cameraGroup.position.set(98, 26, 90);
      this.controls = initControls(); 
      setTimeout(() => {
        EventManager.emit(EVENTS.ABOUT_CLICK)
      }, 1000)
    } else {
      initInteractions()
    }
    const clock = new Clock()
    const animate = () => {
      requestAnimationFrame(this.animate);
      const time = clock.getDelta()
      AnimationManager.update(time)
      if( freeRoam ) {
        this.controls.update()
      }
      this.renderer.render(this.scene, freeRoam ? this.cameraGroup : this.cameraGroup.children[0]);
    };
    this.animate = animate;
    this.animate();
    setupEnvironement();

    window.getManager = () => {
      return this;
    };

    ActionManager.init()
  }
}

const inst = new ThreeManager();

export { inst as ThreeManager };
