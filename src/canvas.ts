import { Container, Rectangle, TextBlock, Control, ScrollViewer, TextWrapping, StackPanel, Button, Grid, ColorPicker } from "@babylonjs/gui/2D";
import { Animation, Node, Mesh, Vector3, WebXRExperienceHelper, Scene, MeshBuilder, StandardMaterial, Texture, TransformNode, OculusTouchController } from "@babylonjs/core";
import { ToolPalette } from "./toolpalette";

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
    // erase(controllerPos: Vector3) {
    //     let offset = 0;
    //     for (let i = 0; i < this.canvasObjects.length; i++) {
    //         if (Math.pow(this.canvasObjects[i - offset].position.x - controllerPos.x, 2) + 
    //                 Math.pow(this.canvasObjects[i - offset].position.y - controllerPos.y, 2) +
    //                 Math.pow(this.canvasObjects[i - offset].position.z - controllerPos.z, 2) < .0004) {
    //             this.canvasObjects[i - offset].dispose();
    //             this.canvasObjects.splice(i - offset, 1);
    //             offset++;
    //         } 
    //     }
    // }

}