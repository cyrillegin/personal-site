/*
    mesh.controller.js
    Authors: Cyrille Gindreau
*/
import {
  Vector3,
  MeshBasicMaterial,
  DoubleSide,
  RepeatWrapping,
  TextureLoader,
  Face3,
  Vector2,
  Mesh,
  Geometry,
} from 'three/build/three.module';
import { applyOffsets, casteljauPoint } from './calculations';

export default class MeshController {
  initMesh(app, boat) {
    const geometry = this.defineGeometry(boat);
    const uvedGeometry = this.defineUvs(geometry);
    const material = this.defineMaterial();
    this.mesh = new Mesh(uvedGeometry, material);
    this.mesh.name = 'boat-mesh';

    app.scene.add(this.mesh);
    // this.setupIO();
    return app;
  }

  // For mirror, there is a copy function, we'll need to do it after a merge of half the boat.
  defineGeometry(boat) {
    const copiedBoat = JSON.parse(JSON.stringify(boat));
    this.boat = {
      width: copiedBoat.width,
      height: copiedBoat.height,
      length: copiedBoat.length,
      frames: copiedBoat.frames,
    };
    Object.keys(copiedBoat).forEach(key => {
      if (['width', 'height', 'length', 'frames'].indexOf(key) > -1) {
        return;
      }
      this.boat[key] = applyOffsets(this.boat, copiedBoat[key], key);
    });

    let parts = [];

    // Outer mesh
    parts = parts.concat(this.splitCurve(this.boat.aftBeam, this.boat.aftChine));
    parts = parts.concat(this.splitCurve(this.boat.foreBeam, this.boat.foreChine));
    parts = parts.concat(this.splitCurve(this.boat.foreChine, this.boat.foreKeel));
    parts = parts.concat(this.splitCurve(this.boat.aftChine, this.boat.aftKeel));
    parts = parts.concat(this.splitCurve(this.boat.aftBeamEdge, this.boat.aftGunEdge));
    parts = parts.concat(this.splitCurve(this.boat.foreBeamEdge, this.boat.foreGunEdge));

    // Define new boat for inner mesh.
    const innerBoat = JSON.parse(JSON.stringify(boat));
    innerBoat.width -= 1;
    innerBoat.height -= 1;
    innerBoat.length -= 1;

    Object.keys(innerBoat).forEach(key => {
      if (['width', 'height', 'length', 'frames'].indexOf(key) > -1) {
        return;
      }
      innerBoat[key] = applyOffsets(innerBoat, innerBoat[key], key);
    });
    // We add on to all the top y values to offset the -1 in height.
    // This will make it so that our trim later on will be perfectly horizontal.
    innerBoat.aftBeam.start[1] += 1;
    innerBoat.aftBeam.end[1] += 1;
    innerBoat.foreBeam.start[1] += 1;
    innerBoat.foreBeam.end[1] += 1;
    innerBoat.aftBeamEdge.start[1] += 1;
    innerBoat.aftBeamEdge.end[1] += 1;
    innerBoat.foreBeamEdge.start[1] += 1;
    innerBoat.foreBeamEdge.end[1] += 1;

    // Add inner mesh.
    parts = parts.concat(this.splitCurve(innerBoat.aftBeam, innerBoat.aftChine));
    parts = parts.concat(this.splitCurve(innerBoat.foreBeam, innerBoat.foreChine));
    parts = parts.concat(this.splitCurve(innerBoat.foreChine, innerBoat.foreKeel));
    parts = parts.concat(this.splitCurve(innerBoat.aftChine, innerBoat.aftKeel));
    parts = parts.concat(this.splitCurve(innerBoat.aftBeamEdge, innerBoat.aftGunEdge));
    parts = parts.concat(this.splitCurve(innerBoat.foreBeamEdge, innerBoat.foreGunEdge));

    // Add trim (The part that attaches the inner boat to the outer boat)
    parts = parts.concat(this.splitCurve(innerBoat.aftBeam, this.boat.aftBeam));
    parts = parts.concat(this.splitCurve(innerBoat.foreBeam, this.boat.foreBeam));
    parts = parts.concat(this.splitCurve(innerBoat.aftBeamEdge, this.boat.aftBeamEdge));
    parts = parts.concat(this.splitCurve(innerBoat.foreBeamEdge, this.boat.foreBeamEdge));

    // Draw mesh.
    const firstElement = parts.pop();
    const initialFace = this.drawFace(firstElement);
    const faces = [];
    for (let i = 0; i < parts.length; i++) {
      faces.push(this.drawFace(parts[i]));
    }

    // Merge faces
    faces.forEach(face => {
      initialFace.merge(face);
    });

    initialFace.mergeVertices();
    initialFace.uvsNeedUpdate = true;

    const mirror = initialFace.clone();
    mirror.scale(-1, 1, 1);
    mirror.mergeVertices();
    mirror.uvsNeedUpdate = true;
    initialFace.merge(mirror);
    initialFace.name = 'boat-mesh';
    return initialFace;
  }

  splitCurve(curveA, curveB) {
    const parts = [];
    const itterations = 8;
    let lastA = casteljauPoint(curveA, 0);
    let lastB = casteljauPoint(curveB, 0);
    for (let i = 1; i < itterations + 1; i++) {
      const currentA = casteljauPoint(curveA, (1 / itterations) * i);
      const currentB = casteljauPoint(curveB, (1 / itterations) * i);
      parts.push({
        start: [[lastA.x, lastA.y, lastA.z], [currentA.x, currentA.y, currentA.z]],
        end: [[lastB.x, lastB.y, lastB.z], [currentB.x, currentB.y, currentB.z]],
      });
      lastA = currentA;
      lastB = currentB;
    }
    return parts;
  }

  drawFace(slice) {
    const geometry = new Geometry();
    const normal = new Vector3(0, 0, 0);
    geometry.vertices.push(
      new Vector3(slice.start[0][0], slice.start[0][1], slice.start[0][2]),
      new Vector3(slice.start[1][0], slice.start[1][1], slice.start[1][2]),
      new Vector3(slice.end[0][0], slice.end[0][1], slice.end[0][2]),
    );
    geometry.faces.push(new Face3(0, 1, 2, normal));

    geometry.vertices.push(
      new Vector3(slice.start[1][0], slice.start[1][1], slice.start[1][2]),
      new Vector3(slice.end[0][0], slice.end[0][1], slice.end[0][2]),
      new Vector3(slice.end[1][0], slice.end[1][1], slice.end[1][2]),
    );
    geometry.faces.push(new Face3(3, 4, 5, normal));

    geometry.computeBoundingSphere();

    return geometry;
  }

  defineUvs(geometry) {
    // NOTE: The following was taken from: https://stackoverflow.com/questions/20774648/three-js-generate-uv-coordinate
    // TODO: We'll need to run our own uving system but this seems to work okay for the time being.
    geometry.faceVertexUvs[0] = [];

    geometry.faces.forEach(face => {
      const components = ['x', 'y', 'z'].sort(
        (a, b) => Math.abs(face.normal[a]) > Math.abs(face.normal[b]),
      );

      const v1 = geometry.vertices[face.a];
      const v2 = geometry.vertices[face.b];
      const v3 = geometry.vertices[face.c];

      geometry.faceVertexUvs[0].push([
        new Vector2(v1[components[0]], v1[components[1]]),
        new Vector2(v2[components[0]], v2[components[1]]),
        new Vector2(v3[components[0]], v3[components[1]]),
      ]);
    });

    geometry.uvsNeedUpdate = true;
    return geometry;
  }

  defineMaterial() {
    const texture = new TextureLoader().load('models/wood_texture.webp');
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(0.1, 0.05);
    const material = new MeshBasicMaterial({ map: texture });
    material.setValues({
      side: DoubleSide,
    });
    return material;
  }

  showMesh(show) {
    this.mesh.visible = show;
  }

  deleteMesh(app) {
    const mesh = app.scene.getObjectByName(this.mesh.name);
    app.scene.remove(mesh);
    return app;
  }
}
