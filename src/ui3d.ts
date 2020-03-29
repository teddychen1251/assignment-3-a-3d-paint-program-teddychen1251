import { Scene, MeshBuilder, Vector3, Mesh, WebXRDefaultExperience, WebXRMotionControllerManager } from "@babylonjs/core";
import { WebXROculusTouchMotionController } from "@babylonjs/core/XR/motionController/webXROculusTouchMotionController";

import { AdvancedDynamicTexture } from "@babylonjs/gui";

import { Dropdown } from "./dropdown";
import { StatusBar } from "./statusbar";
import { ToolPalette } from "./toolpalette";

export class UI3D {
    scene: Scene
    xr: WebXRDefaultExperience
    mainPanel: Mesh
    toolPalette!: ToolPalette

    constructor(scene: Scene, xr: WebXRDefaultExperience) {
        this.scene = scene;
        this.xr = xr;

        this.mainPanel = MeshBuilder.CreatePlane("UI", { width: 8, height: 4 }, scene);
        this.mainPanel.position = new Vector3(0, 2, 8);

        this.buildUI();

        this.registerSummonMenu();
    }

    private buildUI() {
        let planeUI = AdvancedDynamicTexture.CreateForMesh(this.mainPanel, 1024, 512, false);

        let statusBar = new StatusBar("grey", "lightgrey");
        planeUI.addControl(statusBar.container);

        let file = Dropdown.CreateDropdown("File", "120px", "40px", statusBar);
        file.addOption("New", () => {});
        file.addOption("Load", () => {});
        file.addOption("Save", () => {});
        file.addOption("Quit", () => {});
        file.left = "5px"
        planeUI.addControl(file.container);

        let edit = Dropdown.CreateDropdown("Edit", "120px", "40px", statusBar);
        edit.left = "130px";
        planeUI.addControl(edit.container);

        let view = Dropdown.CreateDropdown("View", "120px", "40px", statusBar);
        view.addOption("Next", () => {});
        view.addOption("Previous", () => {});
        view.left = "255px";
        planeUI.addControl(view.container);
        
        this.toolPalette = new ToolPalette("60px", "200px", "lightgrey", statusBar);
        planeUI.addControl(this.toolPalette.container);

    }

    private registerSummonMenu() {
        this.xr.input.onControllerAddedObservable.add(inputSource => {
            inputSource.onMotionControllerInitObservable.add(controller => {
                if (controller.handness === "right") {
                    controller.getComponent("b-button").onButtonStateChangedObservable.add(state => {
                        if(state.pressed) {
                            this.mainPanel.isVisible = !this.mainPanel.isVisible;
                            if (this.mainPanel.isVisible) {
                                this.calcPositionAndRotation();
                            }
                        }
                    });                
                }
            });
        })
    }

    private calcPositionAndRotation() { 
        let cameraYawRotation = this.xr.baseExperience.camera.rotationQuaternion.y;
        if (-.25 < cameraYawRotation && cameraYawRotation <= .25) {
            this.mainPanel.position = new Vector3(0, 2, 8);
            this.mainPanel.rotation = new Vector3(0, 0, 0);
        } else if (.25 < cameraYawRotation && cameraYawRotation <= .75) {
            this.mainPanel.position = new Vector3(-8, 2, 0);
            this.mainPanel.rotation = new Vector3(0, -Math.PI / 2, 0);
        } else if (.75 < cameraYawRotation || cameraYawRotation <= -.75) {
            this.mainPanel.position = new Vector3(0, 2, -8);
            this.mainPanel.rotation = new Vector3(0, Math.PI, 0);
        } else {
            this.mainPanel.position = new Vector3(8, 2, 0);
            this.mainPanel.rotation = new Vector3(0, Math.PI / 2, 0);
        }
    }

}