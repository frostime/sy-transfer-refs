import {
    Plugin,
    Dialog,
    Menu,
} from "siyuan";
import "@/index.scss";
import Pannel from "@/pannel.svelte";
import * as api from "@/api";
import { setNotebookName } from "./utils";

let blockGutterClickEvent: EventListener;
let docGutterClickEvent: EventListener;

export default class PluginTransferRefs extends Plugin {


    async onload() {
        blockGutterClickEvent = (e) => this.onBlockGutterClicked(e);
        docGutterClickEvent = (e) => this.onDocGutterClicked(e);
        this.addTopBar({
            icon: "iconSettings",
            title: "转换引用",
            callback: () => {
                let dialog = new Dialog({
                    title: "转换引用",
                    content: `<div id="pannel" class="fn__flex fn__flex-1"></div>`,
                    width: "1000px",
                    height: "50%"
                });
                new Pannel({
                    target: dialog.element.querySelector("#pannel")
                });
            }
        });
        this.addIcons(`<symbol id="iconTransfer" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2466" width="16" height="16"><path d="M918.186667 34.133333H643.413333c-29.013333 0-51.2 22.186667-51.2 51.2v274.773334c0 29.013333 22.186667 51.2 51.2 51.2h274.773334c29.013333 0 51.2-22.186667 51.2-51.2V85.333333c0-29.013333-23.893333-51.2-51.2-51.2zM380.586667 612.693333H105.813333c-29.013333 0-51.2 22.186667-51.2 51.2V938.666667c0 29.013333 22.186667 51.2 51.2 51.2h274.773334c29.013333 0 51.2-22.186667 51.2-51.2V663.893333c0-27.306667-22.186667-51.2-51.2-51.2z" p-id="2467"></path><path d="M549.546667 97.28c0-18.773333-15.36-34.133333-34.133334-34.133333-249.173333 0-450.56 201.386667-450.56 450.56 0 18.773333 15.36 34.133333 34.133334 34.133333s34.133333-15.36 34.133333-34.133333c0-211.626667 170.666667-382.293333 382.293333-382.293334 18.773333 0 34.133333-15.36 34.133334-34.133333zM931.84 479.573333c-18.773333 0-34.133333 15.36-34.133333 34.133334 0 211.626667-170.666667 382.293333-382.293334 382.293333-18.773333 0-34.133333 15.36-34.133333 34.133333s15.36 34.133333 34.133333 34.133334c249.173333 0 450.56-201.386667 450.56-450.56 0-18.773333-15.36-34.133333-34.133333-34.133334z" p-id="2468"></path></symbol>`)
        this.eventBus.on("click-blockicon", blockGutterClickEvent);
        this.eventBus.on("click-editortitleicon", docGutterClickEvent);
        await this.queryNotebooks();
    }

    onLayoutReady() {

    }

    onunload() {
        this.eventBus.off("click-blockicon", blockGutterClickEvent);
        this.eventBus.off("click-editortitleicon", docGutterClickEvent);
    }

    onBlockGutterClicked({ detail }: any) {
        //一次只移动一个块
        if (detail.blockElements.length > 1) {
            return;
        }

        // detail.menu.addSeparator(0);
        let menu: Menu = detail.menu;
        let protype: HTMLElement = detail.blockElements[0];
        let blockId = protype.getAttribute('data-node-id');
        menu.addItem({
            label: "转移引用",
            icon: "iconTransfer",
            click: () => {
                this.showTransferDialog(blockId);
            }
        });
    }

    onDocGutterClicked({ detail }: any) {
        let blockId = detail.data.id;
        let menu: Menu = detail.menu;
        menu.addItem({
            label: "转移引用",
            icon: "iconTransfer",
            click: () => {
                this.showTransferDialog(blockId);
            }
        });
    }

    private showTransferDialog(blockId: BlockId) {
        let dialog = new Dialog({
            title: "转移引用",
            content: `<div id="pannel" class="fn__flex fn__flex-1"></div>`,
            width: "60%",
            height: "50%"
        });
        new Pannel({
            target: dialog.element.querySelector("#pannel"),
            props: {
                srcBlockID: blockId
            }
        });
    }

    private async queryNotebooks(): Promise<Map<string, string>> {
        let notebookName: Map<string, string> = new Map();
        try {
            let result = await api.lsNotebooks();
            let all_notebooks: Array<Notebook> = result.notebooks;
 
            all_notebooks.forEach((notebook) => {
                notebookName.set(notebook.id, notebook.name);
            });
        } catch (err) {
            console.error(err);
        }
        setNotebookName(notebookName);
        return notebookName;
    }
}
