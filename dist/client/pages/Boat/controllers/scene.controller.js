/*
    scene.controller.js
    Authors: Cyrille Gindreau

    initScene()
    initializes the scene and renderer of THREE scene.

    render()
    renders the next frame of the scene.

*/
import { Scene, PCFSoftShadowMap, WebGLRenderer } from 'three/build/three.module';
import TWEEN from '@tweenjs/tween.js';

function initRenderer(app) {
  app.renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  app.renderer.shadowMap.enabled = true;
  app.renderer.shadowMap.type = PCFSoftShadowMap;
  app.renderer.gammaInput = true;
  app.renderer.gammaOutput = true;
  app.renderer.autoClear = false;
  app.renderer.sortObjects = false;
  app.renderer.setSize(app.container.offsetWidth, app.container.offsetHeight);

  app.renderer.setClearColor(0xffffff, 0);

  app.container.appendChild(app.renderer.domElement);

  app.render = () => {
    // if (app.loaded === false) {
    //   return;
    // }
    app.renderer.render(app.scene, app.camera);
    TWEEN.update();
    requestAnimationFrame(app.render);
  };
  return app;
}

function initScene(container) {
  const app = {
    scene: new Scene(),
    camera: null,
    cameraControls: null,
    lights: {},
    meshes: {},
    renderer: null,
    container,
    loaded: false,
  };
  initRenderer(app);
  return app;
}

export default initScene;
