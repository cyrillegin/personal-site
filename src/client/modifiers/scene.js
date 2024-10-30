import { Color, DirectionalLight, HemisphereLight, Scene, TextureLoader } from "three";
import {
    PointLightHelper,
    LinearSRGBColorSpace
  } from 'three';
  import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { ThreeManager } from '../ThreeManager';

export const initScene = () => {
    const scene = new Scene();
    scene.background = new Color(0x000000);
    return scene
}

export const setupEnvironement = () => {
    loadScene();
    addLights();
}

const addLights = () => {
    const {scene} = ThreeManager;
    // setup a directional light with a cookie shadow
    const light = new DirectionalLight(0x444477, 6);
    light.position.set(0, 100, 100);
    light.castShadow = true;
    scene.add(light);

    // add a hemi light
    const hemiLight = new HemisphereLight(0x444444, 0.5);
    scene.add(hemiLight);
}

const interactableObjects = ["CyrilleBtn", "ResumeBtn", "AboutBtn", "GridfinityBtn", "HomeBtn"];

const loadScene = () => {
    const {scene} = ThreeManager;

    const fbxLoader = new FBXLoader();
    fbxLoader.load('SiteScene.fbx', object => {
      let lampObject;
      let homeBtn;
      object.traverse(child => {
        if (interactableObjects.includes(child.name)) {
            child.interactable = true;
        }
        if (child.isLight) {
          child.castShadow = true;

          child.distance = 100;
          child.intensity = 70;
          child.color = new Color(0xff4444);
          lampObject = child.parent;
          // create helper
          const helper = new PointLightHelper(child, 5);
          scene.add(helper);
        } else if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if(child.name === "HomeBtn") {
            child.visible = false;
          }
     
          const mat = child.material.length && child.material.filter(m => m.name === 'messageMaterial')[0];
            if (mat) {
                mat.map.colorSpace = LinearSRGBColorSpace
                mat.emissive = new Color(0x222222);
            }
        }
      });
      lampObject.receiveShadow = false;
      lampObject.castShadow = false;

    //   addTransformer(lampObject);

      // this.scene.add(this.control);
      scene.add(object);
    });
  }