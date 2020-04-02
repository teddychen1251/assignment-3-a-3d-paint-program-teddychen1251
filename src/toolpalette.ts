import { Container, Rectangle, TextBlock, Control, ScrollViewer, TextWrapping, StackPanel, Button, Grid, ColorPicker } from "@babylonjs/gui/2D";
import { Animation, Node, Color3, Observable } from "@babylonjs/core";
import { StatusBar } from "./statusbar";

export class ToolPalette {
    container: Container;
    width: string;
    height: string;
    background: string;
    toolPalette: StackPanel;
    brushPalette: Grid;
    colorPicker: ColorPicker;
    color: Color3 = Color3.White();
    statusBar: StatusBar;
    currentTexture: string = "";
    currentTool: string = "";
    onCurrentToolChangedObservable: Observable<void> = new Observable();

    constructor(width: string, height: string, background: string, statusBar: StatusBar, secondaryHorAlign?: number, secondaryVertAlign?: number) {
        this.width = width;
        let widthAsNum = parseInt(this.width);
        this.height = height;
        this.background = background;
        let heightAsNum = parseInt(this.height);
        this.statusBar = statusBar;

        this.container = new Container();
        this.container.isHitTestVisible = false;  
        this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;      

        this.toolPalette = new StackPanel();
        this.toolPalette.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.toolPalette.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.toolPalette.isHitTestVisible = false;
        this.toolPalette.width = this.width;
        this.toolPalette.height = this.height;
        this.toolPalette.background = this.background;
        this.toolPalette.top = `-${heightAsNum / 2}px`;

        let line = Button.CreateImageOnlyButton("Line", "textures/diagonalLine.png");
        line.height = `${heightAsNum / 5}px`;
        line.onPointerUpObservable.add(() => {
            this.clearButtons(pen, eraser);
            line.background = "darkgrey";
            this.statusBar.logMessage("Line tool clicked");
            this.currentTool = "line";
            this.onCurrentToolChangedObservable.notifyObservers();
        });
        let pen = Button.CreateImageOnlyButton("Pen", "textures/pen.png");
        pen.height = `${heightAsNum / 5}px`;
        pen.onPointerUpObservable.add(() => {
            this.clearButtons(line, eraser);
            pen.background = "darkgrey";
            this.statusBar.logMessage("Pen tool clicked");
            this.currentTool = "pen";
            this.onCurrentToolChangedObservable.notifyObservers();
        });
        let eraser = Button.CreateImageOnlyButton("Eraser", "textures/eraser.png");
        eraser.height = `${heightAsNum / 5}px`;
        eraser.onPointerUpObservable.add(() => {
            this.clearButtons(line, pen);
            eraser.background = "darkgrey";
            this.statusBar.logMessage("Eraser tool clicked");
            this.currentTool = "eraser";
            this.onCurrentToolChangedObservable.notifyObservers();
        });
        let brush = Button.CreateImageOnlyButton("Brush", "textures/brush.png");
        brush.height = `${heightAsNum / 5}px`;
        brush.onPointerUpObservable.add(() => {
            this.colorPicker.isVisible = false;
            this.brushPalette.isVisible = !this.brushPalette.isVisible;
            this.statusBar.logMessage("Brush palette clicked");
        });
        let colorWheel = Button.CreateImageOnlyButton("Color Wheel", "textures/colorWheel.png");
        colorWheel.height = `${heightAsNum / 5}px`;
        colorWheel.onPointerUpObservable.add(() => {
            this.brushPalette.isVisible = false;
            this.colorPicker.isVisible = !this.colorPicker.isVisible;
            this.statusBar.logMessage("Color wheel clicked");
        });
        this.toolPalette.addControl(line);
        this.toolPalette.addControl(pen);
        this.toolPalette.addControl(eraser);
        this.toolPalette.addControl(brush);
        this.toolPalette.addControl(colorWheel);

        this.container.addControl(this.toolPalette);

        this.toolPalette.onPointerEnterObservable.add(() => {
            this.toolPalette.zIndex = 777;
        });
        this.toolPalette.onPointerOutObservable.add(() => {
            this.toolPalette.zIndex = 0;
        });

        this.brushPalette = new Grid();
        this.brushPalette.verticalAlignment = secondaryVertAlign || Control.VERTICAL_ALIGNMENT_CENTER;
        this.brushPalette.horizontalAlignment = secondaryHorAlign || Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.brushPalette.isHitTestVisible = false;
        this.brushPalette.addColumnDefinition(widthAsNum / 2, true);
        this.brushPalette.addColumnDefinition(widthAsNum / 2, true);
        this.brushPalette.addRowDefinition(heightAsNum / 4, true);
        this.brushPalette.addRowDefinition(heightAsNum / 4, true);
        this.brushPalette.addRowDefinition(heightAsNum / 4, true);
        this.brushPalette.addRowDefinition(heightAsNum / 4, true);
        this.brushPalette.top = secondaryVertAlign ? "0" : "50%";
        // this.brushPalette.left = "-60px";
        this.brushPalette.isVisible = false;
        let brushTextures = [
            "spray.png",
            "streak.jpg",
            "shrek.png",
            "peppa.png",
            "spongebob.jpg",
            "handsome-squidward.jpg",
            "rainbow.png",
            "water.jpg"
        ];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 2; j++) {
                let textureButton = 
                    Button.CreateImageOnlyButton(brushTextures[i * 2 + j], `textures/${brushTextures[i * 2 + j]}`);
                this.brushPalette.addControl(textureButton, i, j);
                textureButton.onPointerUpObservable.add(() => {
                    if (this.currentTexture === `textures/${brushTextures[i * 2 + j]}`) {
                        this.currentTexture = "";
                        textureButton.background = "";
                    } else {
                        this.currentTexture = `textures/${brushTextures[i * 2 + j]}`;
                        this.clearButtons(...(this.brushPalette.children as Button[]));
                        textureButton.background = "darkgrey";
                    }
                });
            }
        }
        this.container.addControl(this.brushPalette);
        
        this.colorPicker = new ColorPicker();
        this.colorPicker.size = this.height;
        this.colorPicker.verticalAlignment = secondaryVertAlign || Control.VERTICAL_ALIGNMENT_CENTER;
        this.colorPicker.horizontalAlignment = secondaryHorAlign || Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.colorPicker.top = secondaryVertAlign ? 0 : `${heightAsNum / 2}px`;
        // this.colorPicker.left = `-${this.colorPicker.widthInPixels}px`;
        this.colorPicker.isVisible = false;
        this.container.addControl(this.colorPicker);
        this.colorPicker.onValueChangedObservable.add(value => this.color = value);
    }

    clearButtons(...buttons: Button[]) {
        for (let button of buttons) {
            button.background = "";
        }
    }
}