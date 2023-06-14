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

const SVG = `<symbol id="iconTransfer" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3385" width="16" height="16"><path d="M512 85.333333a42.666667 42.666667 0 1 0 0 85.333334 341.461333 341.461333 0 0 1 333.525333 268.373333l-58.453333-29.226667a42.666667 42.666667 0 0 0-38.144 76.330667l128 64A42.666667 42.666667 0 0 0 938.666667 511.957333C938.666667 276.352 747.648 85.333333 512 85.333333z" p-id="3386"></path><path d="M314.496 140.202667a174.336 174.336 0 1 0 0 348.586666 174.336 174.336 0 0 0 0-348.586666zM225.536 314.453333a89.002667 89.002667 0 1 1 177.962667 0 89.002667 89.002667 0 0 1-177.962667 0zM709.461333 535.168a174.293333 174.293333 0 1 0 0 348.586667 174.293333 174.293333 0 0 0 0-348.586667z m-88.96 174.293333a88.96 88.96 0 1 1 177.962667 0 88.96 88.96 0 0 1-177.962667 0z" p-id="3387"></path><path d="M105.6 475.733333a42.666667 42.666667 0 0 1 41.514667-1.877333l128 64a42.666667 42.666667 0 1 1-38.186667 76.288l-58.453333-29.184A341.418667 341.418667 0 0 0 512 853.333333a42.666667 42.666667 0 1 1 0 85.333334C276.352 938.666667 85.333333 747.648 85.333333 512a42.666667 42.666667 0 0 1 20.266667-36.266667z" p-id="3388"></path></symbol>`;

export default class PluginTransferRefs extends Plugin {


    async onload() {
        blockGutterClickEvent = (e) => this.onBlockGutterClicked(e);
        docGutterClickEvent = (e) => this.onDocGutterClicked(e);
        this.addIcons(SVG);
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
