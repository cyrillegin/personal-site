import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { ThreeManager } from '../ThreeManager';

export const addTransformer = (object) => {
    const {camera, renderer, scene} = ThreeManager;
    const transformer = new TransformControls(camera, renderer.domElement);
    transformer.addEventListener('change', () => renderer.render(scene, camera));
 
    transformer.addEventListener('dragging-changed', event => {
      controls.enabled = !event.value;
    });

    transformer.attach(object);
    scene.add(transformer);

    return transformer;
}