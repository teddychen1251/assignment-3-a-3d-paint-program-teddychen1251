import { Animation, Node, Mesh, Vector3, WebXRExperienceHelper, Scene, MeshBuilder, StandardMaterial, Texture, TransformNode, OculusTouchController, VertexBuffer, Ray } from "@babylonjs/core";

//for storing the drawing
export class Canvas {
   
    scene: Scene;
    canvasObjects: Mesh[] = [];

    constructor(scene: Scene) {
        this.scene = scene;
    }

    addObject(object: Mesh) {
        this.canvasObjects.push(object);
    }
    erase(eraser: Mesh) {
        let offset = 0;
        for (let i = 0; i < this.canvasObjects.length; i++) {
            if (eraser.intersectsMesh(this.canvasObjects[i - offset])) {
                this.canvasObjects[i - offset].dispose(true, true);
                this.canvasObjects.splice(i - offset, 1);
                offset++;
            } 
        }
    }

}