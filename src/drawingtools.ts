import { MeshBuilder, WebXRDefaultExperience, Scene, Mesh, StandardMaterial } from "@babylonjs/core";

import { Canvas } from "./canvas";
import { ToolPalette } from "./toolpalette";

export class DrawingTools {

    xr: WebXRDefaultExperience
    scene: Scene
    canvas: Canvas
    toolPalette: ToolPalette
    active: boolean
    private lineTip: Mesh
    private penTip: Mesh
    private eraser: Mesh
    private currentAction: () => void = () => {}

    constructor(xr: WebXRDefaultExperience, scene: Scene, canvas: Canvas, toolPalette: ToolPalette) {
        this.xr = xr;
        this.scene = scene;
        this.canvas = canvas;
        this.toolPalette = toolPalette;
        this.toolPalette.onCurrentToolChangedObservable.add(() => this.setCurrentTool());
        this.active = !this.xr.pointerSelection.displaySelectionMesh;

        this.lineTip = MeshBuilder.CreateCylinder("lineTip", { height: 0.04, diameter: .002 }, this.scene);
        this.lineTip.rotation.z = Math.PI / 2;
        this.lineTip.isVisible = false;

        this.penTip = MeshBuilder.CreateCylinder("lineTip", { height: 0.04, diameter: .002 }, this.scene);
        this.penTip.rotation.z = Math.PI / 2;
        this.penTip.isVisible = false;

        this.eraser = MeshBuilder.CreateSphere("eraser", { diameter: 0.06, segments: 8 }, this.scene);
        this.eraser.material = new StandardMaterial("", this.scene);
        this.eraser.material.wireframe = true;
        this.eraser.isVisible = false;
        
        // set all tooltips to controller pos
        this.xr.input.onControllerAddedObservable.add(inputSource => {
            this.lineTip.parent = inputSource.pointer;
            this.penTip.parent = inputSource.pointer;
            this.eraser.parent = inputSource.pointer;
            this.eraser.position.z += .01;
        });
    }

    performCurrentSelection() {
        if (!this.active) {
            return;
        }
        this.currentAction();
    }
    activate() {
        this.active = true;

        this.setCurrentTool()
        this.displayCurrentTool();
    }
    deactivate() {
        this.active = false;

        this.lineTip.isVisible = false;
        this.penTip.isVisible = false;
        this.eraser.isVisible = false;
    }

    private setCurrentTool() {
        switch (this.toolPalette.currentTool) {
            case "line":
                this.setLineAsCurrent();
                break;
            case "pen":
                this.setStrokeAsCurrent()
                break;
            case "eraser":
                this.setEraseAsCurrent();
                break;
            default:
                this.deactivate();
                break;
        }
    }

    private displayCurrentTool() {
        switch (this.toolPalette.currentTool) {
            case "line":
                this.lineTip.isVisible = true;
                break;
            case "pen":
                this.penTip.isVisible = true;
                break;
            case "eraser":
                this.eraser.isVisible = true;
                break;
            default:
                break;
        }
    }

    private setLineAsCurrent = () => this.currentAction = this.drawLine;
    private drawLine() {}

    private setStrokeAsCurrent = () => this.currentAction = this.drawStroke;
    private drawStroke() {}

    private setEraseAsCurrent = () => this.currentAction = this.erase;
    private erase() {}
}