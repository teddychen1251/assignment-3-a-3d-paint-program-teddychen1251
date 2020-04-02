import { Animation, Node, Mesh, Vector3, WebXRExperienceHelper, Scene, MeshBuilder, StandardMaterial, Texture, TransformNode, OculusTouchController, VertexBuffer, Ray } from "@babylonjs/core";

//for storing the drawing
export class Canvas {
   
    scene: Scene;
    canvasObjects: Mesh[] = [];
    // for keeping track of where new strokes start
    indices: number[] = [];

    constructor(scene: Scene) {
        this.scene = scene;
    }

    addIndex() {
        this.indices.push(this.canvasObjects.length);
    }
    addObject(object: Mesh) {
        this.canvasObjects.push(object);
    }
    deleteObject(index: number) {
        this.canvasObjects[index].dispose(true, true);
        this.canvasObjects.splice(index, 1);
    }
    erase(eraser: Mesh) {
        let offset = 0;
        for (let i = 0; i < this.canvasObjects.length; i++) {
            if (eraser.intersectsMesh(this.canvasObjects[i - offset])) {
                this.deleteObject(i - offset);
                offset++;
            } 
        }
    }

}