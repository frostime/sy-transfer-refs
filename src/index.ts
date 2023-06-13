import {
    Plugin,
    Dialog
} from "siyuan";
import "@/index.scss";
import Pannel from "@/pannel.svelte";


export default class PluginTransferRefs extends Plugin {


    onload() {
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
                let pannel = new Pannel({
                    target: dialog.element.querySelector("#pannel")
                });
            }
        })
    }

    onLayoutReady() {

    }

    onunload() {

    }
}
