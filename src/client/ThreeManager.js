
import { initScene,initCamera,initRenderer,initControls,addTransformer, setupEnvironement } from './modifiers';
import { initInteractions } from './modifiers/interactions';

class ThreeManager {
  init(canvas) {
    this.scene = initScene();
    this.cameraGroup = initCamera();
    this.renderer = initRenderer(canvas)
    // this.controls = initControls(); 
    initInteractions()

    const animate = () => {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.cameraGroup.children[0]);
    };
    this.animate = animate;
    this.animate();
    setupEnvironement();

    window.getManager = () => {
      return this;
    };
  }
}

const inst = new ThreeManager();

export { inst as ThreeManager };
