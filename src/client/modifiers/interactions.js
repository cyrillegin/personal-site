import { Raycaster, Vector2, Color } from "three";
import { cameraMap, ThreeManager, STATE } from "../ThreeManager";
import { ActionManager, EventManager, EVENTS } from "../managers";

export const initInteractions = () => {
    setupCameraHandler();
}

 // slightly rotate the camera when the mouse moves
 const onMouseMove = (event) => {
    const { cameraGroup, mouseLock, scene, state } = ThreeManager;
    if(mouseLock) return;
    const initalCameraRotation = cameraMap[ThreeManager.state]
   
    const mouse = new Vector2();
    const { innerWidth, innerHeight } = window;
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;

    cameraGroup.rotation.y = initalCameraRotation.y - mouse.x * 0.1; // Adjust the sensitivity as needed
    cameraGroup.children[0].rotation.x = initalCameraRotation.x + mouse.y * 0.1; // Adjust the sensitivity as needed

    const raycaster = new Raycaster();
    raycaster.setFromCamera(mouse, cameraGroup.children[0]);
    const intersects = raycaster.intersectObjects(scene.children)
        .filter(o => o.object.interactable && o.object.visible)
        .filter(o => {
            if (state === STATE.ABOUT) {
                return o.object.name !== 'CyrilleBtn'
            }
            return true

        })

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        intersectedObject.material.emissive = new Color(0x990000); // Change color to red
        ActionManager.hoveredObject = intersectedObject;
    } else {
        if(ActionManager.hoveredObject) {
            ActionManager.hoveredObject.material.emissive = new Color(0x000000);
            ActionManager.hoveredObject = null;
        }
    }
};

const setupCameraHandler = () => {    

    window.addEventListener('mousemove', onMouseMove);

    window.addEventListener( 'click', () => {
        const { hoveredObject } = ActionManager;
        switch(hoveredObject?.name) {
            case 'AboutBtn':
                EventManager.emit(EVENTS.ABOUT_CLICK)
                break;
            case 'ResumeBtn':
                EventManager.emit(EVENTS.RESUME_CLICK)
                break;
            case 'GridfinityBtn':
                EventManager.emit(EVENTS.GRIDFINITY_CLICK)
                break;
            case 'CyrilleBtn':
                EventManager.emit(EVENTS.ABOUT_CLICK)
                break;
            case 'HomeBtn':
                EventManager.emit(EVENTS.HOME_CLICK)
                break;
        }
    })
}
