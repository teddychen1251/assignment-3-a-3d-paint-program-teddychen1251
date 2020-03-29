import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { WebXROculusTouchMotionController } from "@babylonjs/core/XR/motionController/webXROculusTouchMotionController";
import { Color3, Texture, CubeTexture, Camera, WebXRCamera, WebXRMotionControllerManager, WebXRFeaturesManager, WebXRControllerPointerSelection } from "@babylonjs/core"
import "@babylonjs/core/materials/standardMaterial";

import { UI3D } from "./ui3d";
import { Canvas } from "./canvas";
import { DrawingTools } from "./drawingtools";

// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import {MeshBuilder} from  "@babylonjs/core/Meshes/meshBuilder";

var canvas = document.getElementById("renderCanvas") as HTMLCanvasElement; // Get the canvas element 
var engine = new Engine(canvas, true); // Generate the BABYLON 3D engine

WebXRMotionControllerManager.PrioritizeOnlineRepository = false;

class Draw3D { 
    public static async CreateScene(engine: Engine, canvas: HTMLCanvasElement) {
        // Create the scene space
        var scene = new Scene(engine);
        scene.createDefaultCameraOrLight(true, true, true);
        let envHelper = scene.createDefaultEnvironment({
            skyboxTexture: new CubeTexture("textures/paper", scene),
            skyboxColor: Color3.White(),
            groundTexture: new Texture("textures/wood.jpg", scene),
        });

        const xr = await scene.createDefaultXRExperienceAsync({});

        const ui3D = new UI3D(scene, xr);

        const threeCanvas = new Canvas(scene);
        const drawingTools = new DrawingTools(xr, scene, threeCanvas, ui3D.toolPalette);

        xr.input.onControllerAddedObservable.add(inputSource => {
            inputSource.onMotionControllerInitObservable.add(controller => {
                if (controller.handness === "left") {
                    controller.getComponent("y-button").onButtonStateChangedObservable.add(state => {
                        if (state.pressed) {
                            xr.pointerSelection.displayLaserPointer = !xr.pointerSelection.displayLaserPointer;
                            xr.pointerSelection.displaySelectionMesh = !xr.pointerSelection.displaySelectionMesh;
                            // selection not being displayed
                            if (!xr.pointerSelection.displayLaserPointer) {
                                drawingTools.activate();
                            } else {
                                drawingTools.deactivate();
                            }                      
                        }
                    });
                }
            });
        });

        return scene;
    }
}

/******* End of the create scene function ******/    
// code to use the Class above
var createScene = async function() { 
    return Draw3D.CreateScene(engine, 
        engine.getRenderingCanvas() as HTMLCanvasElement); 
}

var scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(async function () {
    (await scene).render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () { 
    engine.resize();
});