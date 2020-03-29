import { Container, Rectangle, TextBlock, Control, ScrollViewer, TextWrapping, StackPanel } from "@babylonjs/gui";

export class StatusBar {

    container: Container;
    header: Rectangle;
    scrollRegion: ScrollViewer;
    logs: StackPanel;
    lastLog!: TextBlock;
    minimized: boolean = true;

    public constructor(headerColor: string, textAreaColor: string, verticalAlignment?: number) {
        this.container = new StackPanel();
        this.container.verticalAlignment = verticalAlignment || Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.container.isHitTestVisible = false;

        this.header = new Rectangle();
        this.header.background = headerColor;
        this.header.height = "20px";
        this.header.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.header.isPointerBlocker = true;

        let headerText = new TextBlock(undefined, "Status Bar");
        headerText.paddingLeft = "5px";
        headerText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.header.addControl(headerText);

        this.scrollRegion = new ScrollViewer();
        this.scrollRegion.background = textAreaColor;
        this.scrollRegion.height = "25px";
        this.scrollRegion.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

        this.logs = new StackPanel();
        this.logMessage("Welcome to Draw3D");

        this.header.onPointerUpObservable.add(() => {
            this.container.zIndex = 777;
            this.minimized = !this.minimized;
            this.scrollRegion.height = this.minimized ? "25px" : `${512 - 20}px`;
            this.scrollRegion.clearControls();
            if (this.minimized) {
                this.scrollRegion.addControl(this.lastLog);
            } else {
                this.scrollRegion.addControl(this.logs);
            }
        });

        this.container.addControl(this.header);
        this.container.addControl(this.scrollRegion);
    }
    // TODO: fix wrapping for big strings
    logMessage(message: string) {
        this.logs.addControl(this.generateLog(message));
        this.lastLog = this.generateLog(message);
        if (this.minimized) {
            this.scrollRegion.clearControls();
            this.scrollRegion.addControl(this.lastLog);
        }
        while (this.logs.children.length > 70) {
            this.logs.children.shift();
        }
    }

    private generateLog(message: string): TextBlock {
        let log = new TextBlock(undefined, message);
        log.textWrapping = TextWrapping.WordWrap;
        log.resizeToFit = true;
        log.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        log.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        log.paddingLeft = "5px";
        return log;
    }
}