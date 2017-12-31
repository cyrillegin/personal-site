import 'three';
import 'three/examples/js/loaders/OBJLoader';
import 'three/examples/js/controls/OrbitControls';

export default class threejs {

    constructor() {
        const container = document.getElementById('renderer');
        const app = this.createApp();
        app.init(container);
        app.render();
    }

    createApp() {
        const app = {
            meshes: [],
            currentScene: null,
            loaded: false,
            camera: null,
            sun: null,
            scene: null,
            renderer: null,
            cameraControls: null,
            backlight: null,
            container: null,
            loaded: false,
            loadMesh: this.loadMesh,
            mouse: null,
            raycaster: null,
            INTERSECTED: null,
            arcs: [],
            init(container) {
                app.loaded = false;
                app.container = container;
                if (app.scene === null) {
                    app.scene = new THREE.Scene();
                    initRenderer();
                    initCamera();
                    initLights();
                }
                function initRenderer() {
                    app.renderer = new THREE.WebGLRenderer({
                        antialias: true,
                        alpha: true,
                    });
                    app.renderer.shadowMap.enabled = true;
                    app.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                    app.renderer.gammaInput = true;
                    app.renderer.gammaOutput = true;
                    app.renderer.autoClear = false;
                    app.renderer.sortObjects = false;
                    app.renderer.setSize(container.offsetWidth, container.offsetHeight);

                    app.renderer.setClearColor(0xffffff, 0);
                    container.appendChild(app.renderer.domElement);
                    $(app.renderer.domElement).css('position', 'absolute');
                }
                function initLights() {
                    app.sun = new THREE.SpotLight(0xffffff, 1);
                    app.sun.position.set(-60, 60, 60);
                    app.sun.angle = 1.1;
                    app.sun.decay = 0;
                    app.sun.castShadow = true;

                    app.sun.shadow.mapSize.width = 2048;
                    app.sun.shadow.mapSize.height = 2048;
                    app.sun.shadow.camera.near = 1;
                    app.sun.shadow.camera.far = 80000;
                    app.scene.add(app.sun);
                    app.backlight = new THREE.AmbientLight(0xffffff, 0.3);
                    app.backlight.position.set(10, -10, -10);
                    app.scene.add(app.backlight);
                }
                function initCamera() {
                    app.camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 2, 80000);
                    app.camera.position.set(25, 15, 0);
                    app.camera.lookAt(app.scene.position);
                    app.cameraControls = new THREE.OrbitControls(app.camera, app.renderer.domElement);
                    app.raycaster = new THREE.Raycaster();
                    app.mouse = new THREE.Vector2();
                    function onDocumentMouseMove(event) {
                        event.preventDefault();
                        app.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                        app.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
                    }
                    document.addEventListener('mousemove', onDocumentMouseMove, false);
                }

                // Create meshes
                async function initMesh() {
                    const apartment = await app.loadMesh('models/apartment.obj');
                    app.scene.add(apartment);
                    app.meshes.push(apartment);

                    const home = new THREE.Vector3(8.7, 6.3, -7.2);

                    const ras1 = new THREE.Vector3(-13, 5, -7.2);
                    buildArc(home, ras1);

                    const ras2 = new THREE.Vector3(20, 3, -7.2);
                    buildArc(home, ras2);

                    const ras3 = new THREE.Vector3(20.4, 2.7, -25.4);
                    buildArc(home, ras3);
                }

                function buildArc(start, end) {
                    const group = new THREE.Group();
                    app.scene.add(group);

                    const A = end.x - start.x;
                    const B = end.z - start.z;
                    const C = Math.sqrt(A ** 2 + B ** 2);
                    let a = Math.asin(A / C);

                    const arc = new THREE.Path();
                    arc.moveTo(0, 0);
                    const third = C / 3;
                    arc.bezierCurveTo(third, third / 2, third * 2, third, C, end.y - start.y);

                    arc.autoClose = true;
                    const spacedPoints = arc.getSpacedPoints(C * 10);
                    const geometrySpacedPoints = new THREE.BufferGeometry().setFromPoints(spacedPoints);

                    const particles = new THREE.Points(geometrySpacedPoints, new THREE.PointsMaterial({color: 0x008000, size: 0.1}));
                    particles.position.set(start.x, start.y, start.z);
                    
                    if (start.z > end.z) {
                        a = -a + Math.PI;
                    }
                    console.log(a);
                    particles.rotation.set(0, a, 0);
                    particles.scale.set(1, 1, 1);

                    group.add(particles);
                    app.arcs.push(particles);
                }
                initMesh();
            },

            render() {
                if (!app.loaded && app.meshes.length > 0) {
                    app.sun.target = app.meshes[0];
                    app.loaded = true;
                    app.renderer.setSize(app.container.offsetWidth, app.container.offsetHeight);
                    app.hide = false;
                }

                // if (app.loaded) {
                //     app.raycaster.setFromCamera(app.mouse, app.camera);
                //     const intersects = app.raycaster.intersectObjects(app.arcs, true);
                // 
                //     if (intersects.length > 0) {
                //         if (app.INTERSECTED !== intersects[0].object) {
                //             if (app.INTERSECTED) {
                //                 app.INTERSECTED.material.emissive.setHex(app.INTERSECTED.currentHex);
                //             }
                //             app.INTERSECTED = intersects[0].object;
                //             console.log(app.INTERSECTED)
                //             app.INTERSECTED.currentHex = app.INTERSECTED.material.color.getHex();
                //             app.INTERSECTED.material.color.setHex(0xff0000);
                //         }
                //     } else {
                //         if (app.INTERSECTED) {
                //             app.INTERSECTED.material.color.setHex(app.INTERSECTED.currentHex);
                //         }
                //         app.INTERSECTED = null;
                //     }
                // }

                if (app.renderer) {
                    app.renderer.render(app.scene, app.camera);
                    requestAnimationFrame(app.render);
                }
            },
            destroy() {
                app.renderer.forceContextLoss();
                app.renderer.context = null;
                app.renderer.domElement = null;
                app.renderer = null;
            },
        };
        return app;
    }

    loadMesh(file) {
        return new Promise((resolve, reject) => {
            const objLoader = new THREE.OBJLoader();
            objLoader.load(
                file,
                (object) => {
                    resolve(object);
                },
                // called when loading is in progresses
                (xhr) => {
                    console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
                },
                // called when loading has errors
                (error) => {
                    console.log('An error happened');
                    reject(error);
                },
            );
        });
    }
}
