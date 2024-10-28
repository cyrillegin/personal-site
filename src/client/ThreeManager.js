import { ACESFilmicToneMapping, BoxGeometry, Color, Mesh, MeshBasicMaterial, PCFSoftShadowMap, PerspectiveCamera, PointLightHelper, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

class ThreeManager {
  init(canvas) {
    this.scene = new Scene();
    this.scene.background = new Color( 0xbfe3dd );
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera = new PerspectiveCamera(45, width / height, 0.1, 10000);
    this.camera.position.set(71, 42, 99);

    this.scene.add(this.camera);
    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    
    canvas.appendChild(renderer.domElement);
    this.renderer = renderer;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set( 0, 10, 0 );
    this.controls.update();
    this.controls.enableDamping = true;

    this.control = new TransformControls( this.camera, renderer.domElement );
    this.control.addEventListener( 'change', () => this.renderer.render(this.scene, this.camera) );
    this.size = 10;
    this.control.addEventListener( 'dragging-changed',  ( event ) => {
      this.controls.enabled = ! event.value;
    } );

    const animate = () => {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    };
    this.animate = animate;
    this.animate();
    this.loadScene();

    window.getManager = () => {
      return this;
    };
  }

  loadScene() {
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      'SiteScene.fbx',
      (object) => {

        let lampObject;
        object.traverse(child => {
          if(child.isLight) {
            child.castShadow = true;
            
            child.distance = 100;
            child.intensity = 100;
            lampObject = child.parent;
            // create helper
            const helper = new PointLightHelper(child, 5);
            this.scene.add(helper);
          }
          if(child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        lampObject.receiveShadow = false;
        lampObject.castShadow = false;
        
        this.control.attach(lampObject);
        this.scene.add( this.control );
        this.scene.add(object);
      });
  }
}

const inst = new ThreeManager();

export { inst as ThreeManager };
