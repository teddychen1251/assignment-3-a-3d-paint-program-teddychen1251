import { MeshBuilder, WebXRDefaultExperience, Scene, Mesh, StandardMaterial, Vector3, Texture, TransformNode, AbstractMesh } from "@babylonjs/core";

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
    private ribbonBuffer: Vector3[][] = [[], []]
    private currentRibbon: Mesh = new Mesh("");
    private triggerPressed: boolean = false;
    private frameCount: number = 0;

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
            inputSource.onMotionControllerInitObservable.add(controller => {
                if (controller.handness === "right") {
                    controller.onModelLoadedObservable.add(loadedController => {
                        let pointer = loadedController.rootMesh!;
                        this.lineTip.parent = pointer;
                        this.lineTip.position = new Vector3(-.0075, 0, -.06);
                        this.penTip.parent = pointer;
                        this.penTip.position = new Vector3(-.0075, 0, -.06);
                        this.eraser.parent = pointer;
                        this.eraser.position = new Vector3(-.01, 0, -.075);
                    });
                    controller.getComponent("xr-standard-trigger").onButtonStateChangedObservable.add(state => {
                        if (state.pressed) {
                            this.triggerPressed = true;
                        } else if (state.hasChanges && state.changes.pressed?.previous) {
                            this.triggerPressed = false;
                            this.frameCount = 0;

                            this.finishCurrentSelection();
                        }
                    });
                }
            });
        });

        // point/position collecting for drawing/erasing
        // ribbon will be dynamicly created during trigger pressed
        scene.registerBeforeRender(() => {
            if (!this.triggerPressed) return;
            this.frameCount %= 2;
            if (this.frameCount === 0) {
                this.performCurrentSelection();
            }
            this.frameCount++;
        });
    }



    performCurrentSelection() {
        if (!this.active) {
            return;
        }
        this.currentAction();
    }
    finishCurrentSelection() {
        switch (this.toolPalette.currentTool) {
            case "line":
                this.canvas.addObject(this.currentRibbon!);
                this.ribbonBuffer = [[], []];
                this.currentRibbon = new Mesh("");
                break;
            case "pen":
                this.canvas.addObject(this.createRibbon());
                this.ribbonBuffer = [[], []];
                this.currentRibbon = new Mesh("");
                break;
            case "eraser":
                break;
            default:
                break;
        }
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
                this.currentAction = this.registerLine;
                break;
            case "pen":
                this.currentAction = this.registerStroke;
                break;
            case "eraser":
                this.currentAction = this.erase;
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

    private registerLine() {
        let lineTipPosWorld = this.lineTip.getAbsolutePosition();
        let controllerRotation = (this.lineTip.parent as AbstractMesh).absoluteRotationQuaternion;
        if (this.ribbonBuffer[0].length >= 2) {
            this.ribbonBuffer[0].pop();
            this.ribbonBuffer[1].pop();
        }
        this.ribbonBuffer[0].push(lineTipPosWorld.add(new Vector3(.02, 0, 0))
            .rotateByQuaternionAroundPointToRef(controllerRotation, lineTipPosWorld, new Vector3()));
        this.ribbonBuffer[1].push(lineTipPosWorld.add(new Vector3(-.02, 0, 0))
            .rotateByQuaternionAroundPointToRef(controllerRotation, lineTipPosWorld, new Vector3()));
        if (this.ribbonBuffer[0].length === 2) {
            if (this.currentRibbon !== null) {
                this.currentRibbon.dispose(true, true);
            }
            this.currentRibbon = this.createRibbon();
        }
    }

    private registerStroke() {
        let penTipPosWorld = this.penTip.getAbsolutePosition();
        let controllerRotation = (this.penTip.parent as AbstractMesh).absoluteRotationQuaternion;
        this.ribbonBuffer[0].push(penTipPosWorld.add(new Vector3(.02, 0, 0))
            .rotateByQuaternionAroundPointToRef(controllerRotation, penTipPosWorld, new Vector3()));
        this.ribbonBuffer[1].push(penTipPosWorld.add(new Vector3(-.02, 0, 0))
            .rotateByQuaternionAroundPointToRef(controllerRotation, penTipPosWorld, new Vector3()));
        if (this.ribbonBuffer[0].length === 2) {
            this.currentRibbon = this.createRibbon();
            this.canvas.addObject(this.currentRibbon);
            this.ribbonBuffer[0] = [this.ribbonBuffer[0][1]];
            this.ribbonBuffer[1] = [this.ribbonBuffer[1][1]];
        }
    }
    
    private erase() {
        this.canvas.erase(this.eraser);
    }

    private createRibbon(): Mesh {
        let newRibbon = MeshBuilder.CreateRibbon("", { pathArray: this.ribbonBuffer, sideOrientation: Mesh.DOUBLESIDE }, this.scene);
        let newMaterial = new StandardMaterial("", this.scene);
        newMaterial.backFaceCulling = false;
        newMaterial.diffuseColor = this.toolPalette.color.clone();
        if (this.toolPalette.currentTexture) {
            newMaterial.diffuseTexture = new Texture(this.toolPalette.currentTexture, this.scene);
        }
        newRibbon.material = newMaterial;
        return newRibbon;
    }
}