import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThreeManager } from '../ThreeManager';

export const initControls = () => {
    const {cameraGroup, renderer} = ThreeManager;
    const controls = new OrbitControls(cameraGroup, renderer.domElement);
    controls.target.set(0, 10, 0);
    controls.update();
    controls.enableDamping = true;
    return controls;
}