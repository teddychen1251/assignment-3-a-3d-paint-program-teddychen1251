import { Button, Container, Control, StackPanel } from "@babylonjs/gui";
import { StatusBar } from "./statusbar";

interface Option {
    name: string
    action: () => any
}

export class Dropdown {
    width: string;
    height: string;
    color: string;
    background: string;
    name: string;
    options: Option[];
    optionsPanel: StackPanel;
    readonly container: Container;
    primaryButton: Button;
    private _top: string = "0px";
    private _left: string = "0px";
    statusBar: StatusBar;

    static CreateDropdown(name: string, width: string, height: string, statusBar: StatusBar, options?: Option[]): Dropdown {
        return new this(name, width, height, options ? options : [], statusBar);
    }

    private constructor(name: string, width: string, height: string, options: Option[], statusBar: StatusBar) {
        this.width = width;
        this.height = height;
        this.name = name;
        this.options = options ? options : []
        this.color = "black";
        this.background = "white";
        this.statusBar = statusBar;

        this.container = new Container();
        this.container.width = this.width;
        this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.container.isHitTestVisible = false;
        this.container.top = this._top;
        this.container.left = this._left;

        this.primaryButton = Button.CreateSimpleButton(this.name, this.name);
        this.primaryButton.height = this.height;
        this.primaryButton.background = this.background;
        this.primaryButton.color = this.color;
        this.primaryButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

        this.optionsPanel = new StackPanel();
        this.optionsPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.optionsPanel.top = this.height;
        this.optionsPanel.isVisible = false;
        this.optionsPanel.isVertical = true;
        this.options.forEach(option => this.addOption(option.name, option.action));

        this.primaryButton.onPointerUpObservable.add(() => {
            this.optionsPanel.isVisible = !this.optionsPanel.isVisible;
        });
        
        this.container.onPointerEnterObservable.add(() => {
            this.container.zIndex = 777;
        });
        this.container.onPointerOutObservable.add(() => {
            this.container.zIndex = 0;
        });

        this.container.addControl(this.primaryButton);
        this.container.addControl(this.optionsPanel);
    }

    get top(): string {
        return this._top;
    }
    set top(newTop: string) {
        this._top = newTop;
        this.container.top = newTop;
    }

    get left(): string {
        return this._left;
    }
    set left(newLeft: string) {
        this._left = newLeft;
        this.container.left = newLeft;
    }

    addOption(name: string, action: () => any) {
        let option = Button.CreateSimpleButton(name, name);
        option.height = this.height;
        option.background = this.background;
        option.color = this.color;
        option.onPointerUpObservable.add(() => {
            this.optionsPanel.isVisible = false;
            this.statusBar.logMessage(`${name.charAt(0).toUpperCase() + name.substring(1)} clicked`);
        });
        option.onPointerClickObservable.add(action);
        this.optionsPanel.addControl(option);
        this.options.push({name: name, action: action});
    }
}