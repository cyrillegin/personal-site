
import { EventManager, EVENTS } from ".";
import { Vector3, Color, SpotLight, SpotLightHelper } from "three";
import { ThreeManager, STATE } from "../ThreeManager";
import { createTrack, playAnimation } from "./AnimationManager";
import { remove } from "three/examples/jsm/libs/tween.module.js";
import { addCameraHandler, removeCameraHandler } from "../modifiers/interactions";
import { degToRad } from "three/src/math/MathUtils.js";

class ActionManager {

    init() {
        this.initalCameraRotation = ThreeManager.cameraGroup.rotation.clone();
        this.mouseLock = false;
        this.hoveredObject = null;
        EventManager.addEventListener(EVENTS.ABOUT_CLICK, inst.handleAboutClick);
        EventManager.addEventListener(EVENTS.RESUME_CLICK, inst.handleResumeClick);
        EventManager.addEventListener(EVENTS.GRIDFINITY_CLICK, inst.handleGridfinityClick);
        EventManager.addEventListener(EVENTS.HOME_CLICK, inst.handleHomeClick);

    }

    handleAboutClick() {
        ThreeManager.mouseLock = true
        ThreeManager.state = STATE.ABOUT
        const { cameraGroup } = ThreeManager;
        inst.hoveredObject.material.emissive = new Color(0x000000);
        inst.hoveredObject = null;

        const transitionDuration = 1;
        const startLocation = cameraGroup.position.clone();
        const startRotation = cameraGroup.rotation.clone();
        const startCamRot = cameraGroup.children[0].rotation.clone();
        const targetLocation = new Vector3(81, 6.9, -0.6);
        const targetRotation = new Vector3(0, Math.PI / 2, 0);
        const targetCamRot = new Vector3(degToRad(10), 0, 0);

        const posTracks = ['x', 'y', 'z'].map(e =>
            createTrack(e, startLocation, targetLocation, transitionDuration)
        )
        const rotTracks = ['x', 'y', 'z'].map(e => createTrack(e, startRotation, targetRotation, transitionDuration))
        const camRotTracks = ['x', 'y', 'z'].map(e => createTrack(e, startCamRot, targetCamRot, transitionDuration))

        playAnimation(posTracks, cameraGroup.position, transitionDuration)
        playAnimation(camRotTracks, cameraGroup.children[0].rotation, transitionDuration)
        playAnimation(rotTracks, cameraGroup.rotation, transitionDuration, () => {
            ThreeManager.mouseLock = false
            const aboutLight = new SpotLight(0xffffff, 20);
            aboutLight.position.set(81, 6.9, -0.6);
            aboutLight.target.position.set(55, 10, -0.6);
            aboutLight.distance = 20;
            aboutLight.angle = degToRad(28)
            aboutLight.penumbra = 0.2;

            ThreeManager.scene.add(aboutLight);
            const helper = new SpotLightHelper(aboutLight);
            // ThreeManager.scene.add(helper);

            ThreeManager.scene.traverse(child => {
                if(child.name === "AboutBtn") {
                    child.visible = false;
                }
                if(child.name === "HomeBtn") {
                    child.visible = true;
                }
            })

        })
    }

    handleResumeClick() {
        console.log('Resume button clicked');
        // Add your logic here
    }

    handleGridfinityClick() {
        console.log('Gridfinity button clicked');
        // Add your logic here
    }

    handleHomeClick() {
        ThreeManager.mouseLock = true
        ThreeManager.state = STATE.HOME
        const { cameraGroup } = ThreeManager;
        inst.hoveredObject.material.emissive = new Color(0x000000);
        inst.hoveredObject = null;

        const transitionDuration = 1;
        const startLocation = cameraGroup.position.clone();
        const startRotation = cameraGroup.rotation.clone();
        const startCamRot = cameraGroup.children[0].rotation.clone();
        const targetLocation = new Vector3(107, 26, 115);
        const targetRotation = new Vector3(0, degToRad(36), 0);
        const targetCamRot = new Vector3(0, 0, 0);

        const posTracks = ['x', 'y', 'z'].map(e =>
            createTrack(e, startLocation, targetLocation, transitionDuration)
        )
        const rotTracks = ['x', 'y', 'z'].map(e => createTrack(e, startRotation, targetRotation, transitionDuration))
        const camRotTracks = ['x', 'y', 'z'].map(e => createTrack(e, startCamRot, targetCamRot, transitionDuration))

        playAnimation(posTracks, cameraGroup.position, transitionDuration)
        playAnimation(camRotTracks, cameraGroup.children[0].rotation, transitionDuration)
        playAnimation(rotTracks, cameraGroup.rotation, transitionDuration, () => {
            ThreeManager.mouseLock = false
        })
    }
 
}

const inst = new ActionManager();
export { inst as ActionManager };