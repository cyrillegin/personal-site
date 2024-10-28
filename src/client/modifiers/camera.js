import { PerspectiveCamera, Euler, Group } from "three";
import { ThreeManager } from '../ThreeManager';
import { degToRad } from "three/src/math/MathUtils.js";

export const initCamera = () => {
    const {scene} = ThreeManager;
    const {innerWidth: width, innerHeight: height} = window;
    const camera = new PerspectiveCamera(45, width / height, 0.1, 10000);
    
    

    // group handle Y, cam handle XZ
    const cameraGroup = new Group();
    cameraGroup.add(camera);
    cameraGroup.position.set(100, 25, 140);
    cameraGroup.setRotationFromEuler(new Euler(0, degToRad(36), 0));

    scene.add(cameraGroup);
    return cameraGroup
}