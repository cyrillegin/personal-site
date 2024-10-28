import { Raycaster, Vector2, Color } from "three";
import { ThreeManager } from "../ThreeManager";


export const initInteractions = () => {
    setupCameraHandler();
}

const setupCameraHandler = () => {
    const { cameraGroup,scene } = ThreeManager;
    const raycaster = new Raycaster();
    const mouse = new Vector2();
    const initalCameraRotation = cameraGroup.rotation.clone();
    let hoveredObject = null;
    // slightly rotate the camera when the mouse moves
    window.addEventListener('mousemove', (event) => {
        const { innerWidth, innerHeight } = window;
        mouse.x = (event.clientX / innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / innerHeight) * 2 + 1;
        // Handle camera
        cameraGroup.rotation.y = initalCameraRotation.y - mouse.x * 0.1; // Adjust the sensitivity as needed
        cameraGroup.children[0].rotation.x = initalCameraRotation.x + mouse.y * 0.1; // Adjust the sensitivity as needed
    
        // Handle intersections
        raycaster.setFromCamera(mouse, cameraGroup.children[0]);
        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            console.log('Intersected object:', intersectedObject);
            intersectedObject.material.emissive = new Color(0x770000); // Change color to red
            hoveredObject = intersectedObject;
        } else {
            if(hoveredObject) {
                hoveredObject.material.emissive = new Color(0x000000);
                hoveredObject = null;
            }
        }
    });
}
