import {
    ACESFilmicToneMapping,
    PCFSoftShadowMap,
    WebGLRenderer,
  } from 'three';

export const initRenderer = (canvas) => {
    const {innerWidth: width, innerHeight: height} = window;

    const renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
      });
      renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    canvas.appendChild(renderer.domElement);
    return renderer;
}