import { Container, Rectangle, TextBlock, Control, ScrollViewer, TextWrapping, StackPanel, Button, Grid, ColorPicker } from "@babylonjs/gui/2D";
import { Animation, Node, Mesh, Vector3, WebXRExperienceHelper, Scene, MeshBuilder, StandardMaterial, Texture, TransformNode, OculusTouchController } from "@babylonjs/core";
import { ToolPalette } from "./toolpalette";

export class Canvas {
   
    // scene: Scene;
    // xrHelper: WebXRExperienceHelper;
    // toolPalette: ToolPalette;
    // canvasObjects: Mesh[] = [];
    // active: boolean = false;
    // rayOn: boolean = true;

    constructor(scene: Scene, xrHelper: WebXRExperienceHelper, toolPalette: ToolPalette) {
        // this.vrHelper = vrHelper;
        // this.toolPalette = toolPalette;
        // this.vrHelper.onControllerMeshLoadedObservable.add(controller => {
        //     if (controller.hand === "right") {
        //         controller.onTriggerStateChangedObservable.add(event => {
        //             if (event.pressed) {
        //                 this.active = true;
        //             } else {
        //                 this.active = false;
        //             }
        //         });
        //         (controller as OculusTouchController).onAButtonStateChangedObservable.add(event => {
        //             if (event.pressed) {
        //                 this.rayOn = !this.rayOn;
        //             }
        //         });
        //         eraserGhost.position = vrHelper.webVRCamera.rightController!.devicePosition;;
        //     }
        // });
        // this.scene = scene;
        // let eraserGhost = MeshBuilder.CreateSphere("eraserGhost", { diameter: .04, segments: 8 }, this.scene);
        // eraserGhost.material = new StandardMaterial("", scene);
        // eraserGhost.material.wireframe = true;
        // eraserGhost.isVisible = false;
        // scene.registerBeforeRender(() => {
        //     eraserGhost.isVisible = false;
        //     if (this.active && !this.rayOn) {
        //         let controllerTip = new TransformNode("");
        //         controllerTip.position = vrHelper.webVRCamera.rightController!.devicePosition;
        //         switch (this.toolPalette.currentTool) {
        //             case "line":
        //                 let box = MeshBuilder.CreateBox("", { size: .01 }, this.scene);
        //                 box.position = controllerTip.position.clone();
        //                 let boxMat = new StandardMaterial("", this.scene);
        //                 boxMat.diffuseColor = this.toolPalette.color.clone();
        //                 boxMat.diffuseTexture = this.toolPalette.currentTexture === "" ? null : new Texture(this.toolPalette.currentTexture, this.scene);
        //                 box.material = boxMat;
        //                 this.addObject(box);
        //                 break;
        //             case "pen":
        //                 let sphere = MeshBuilder.CreateSphere("", { diameter: .01 }, this.scene);
        //                 sphere.position = controllerTip.position.clone();
        //                 let sphMat = new StandardMaterial("", this.scene);
        //                 sphMat.diffuseColor = this.toolPalette.color.clone();
        //                 sphMat.diffuseTexture = this.toolPalette.currentTexture === "" ? null : new Texture(this.toolPalette.currentTexture, this.scene);
        //                 sphere.material = sphMat;
        //                 this.addObject(sphere);
        //                 break;
        //             case "eraser":
        //                 eraserGhost.isVisible = true;
        //                 this.erase(controllerTip.position.clone());
        //                 break;
        //             default:
        //                 break;
        //         }
        //     }
        // });
    }

    // addObject(object: Mesh) {
    //     this.canvasObjects.push(object);
    // }
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