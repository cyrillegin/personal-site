import {
  initScene,
  initLights,
  CameraController,
  MeshController,
  CurvesController,
} from './controllers';

class ThreeManager {
  constructor() {
    //   this.app = initScene(document.querySelector('#canvas'));
    //   this.app = initLights(this.app);
    //   this.cameraController = new CameraController();
    //   this.app = this.cameraController.initCamera(this.app);
    //   this.meshController = new MeshController();
    //   this.curveController = new CurvesController();
    //   this.props
    //     .getBoat('default')
    //     .then(res => res.json())
    //     .then(data => {
    //       this.app = this.curveController.initCurves(this.app, data);
    //       this.curveController.updateFrames(this.app, data);
    //       this.meshController.initMesh(this.app, data);
    //       this.meshController.showMesh(this.app.displayShaded);
    //       // this.oldValues = JSON.parse(JSON.stringify(this.boatParametersService.updatePoint(data)));
    //       this.app.render();
    //       this.setState({
    //         loaded: true,
    //         boat: data,
    //       });
    //     });
  }
}

const inst = new ThreeManager();

export { inst as ThreeManager };
