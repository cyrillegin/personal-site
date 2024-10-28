import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThreeManager } from '../ThreeManager';

export const initControls = () => {
    const {camera, renderer} = ThreeManager;
    console.log(camera);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 10, 0);
    controls.update();
    controls.enableDamping = true;
    return controls;
}