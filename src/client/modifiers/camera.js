import { PerspectiveCamera, Euler, Group, Vector3 } from "three";
import { ThreeManager } from '../ThreeManager';
import { degToRad } from "three/src/math/MathUtils.js";

const inspectorCam = new Vector3(98, 26, 95);
const fullScreenCam = new Vector3(107, 26, 115);
export const initCamera = () => {
    const {scene} = ThreeManager;
    const {innerWidth: width, innerHeight: height} = window;
    const camera = new PerspectiveCamera(45, width / height, 0.1, 10000);
    
    // group handle Y, cam handle XZ
    const cameraGroup = new Group();
    cameraGroup.add(camera);
    
    cameraGroup.position.set(fullScreenCam.x, fullScreenCam.y, fullScreenCam.z);   
    cameraGroup.setRotationFromEuler(new Euler(0, degToRad(36), 0));

    scene.add(cameraGroup);
    return cameraGroup
}