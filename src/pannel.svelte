<script lang="ts">
    import { Plugin, showMessage } from "siyuan";
    import * as api from "./api";
    import { notebookName, getChildDocs, isnot, i18n } from "@/utils";

    export let plugin: Plugin;
    export let srcBlockID: BlockId;

    let refBlockInfo: any[] = [];
    let checkboxTitle: HTMLInputElement;

    let dstChoose: string = "";
    let refChoose: BlockId[] = [];
    let dstBlockID: BlockId = "";
    $: dstBlockID = dstChoose;

    function clickCheckboxBlock() {
        if (checkboxTitle) {
            if (refChoose.length === 0) {
                checkboxTitle.checked = false;
                checkboxTitle.indeterminate = false;
            } else if (refChoose.length === refBlockInfo.length) {
                checkboxTitle.checked = true;
                checkboxTitle.indeterminate = false;
            } else {
                checkboxTitle.checked = false;
                checkboxTitle.indeterminate = true;
            }
        }
    }

    function clickCheckboxTitle() {
        let checked = checkboxTitle.checked;
        if (checked) {
            refChoose = refBlockInfo.map((block) => block.id);
        } else {
            refChoose = [];
        }
    }

    function clipStr(str: string, len: number) {
        if (str.length > len) {
            return str.slice(0, len) + "...";
        } else {
            return str;
        }
    }

    async function queryRefs() {
        let sqlQuery = `select * from blocks where id in (
        select block_id from refs where def_block_id = '${srcBlockID}') order by updated desc`;
        let refBlocks: Block[] = await api.sql(sqlQuery);
        refBlockInfo = [];
        for (let block of refBlocks) {
            refBlockInfo.push({
                id: block.id,
                type: block.type,
                notebook: notebookName.get(block.box) ?? block.box,
                // doc: block.hpath.split("/").pop(),
                doc: block.hpath,
                content: block.content,
            });
        }
        return refBlockInfo;
    }

    /**
     * 查询父节点和直接子节点
     */
    async function queryFamily() {
        let srcBlock: Block = await api.getBlockByID(srcBlockID);
        let children: Block[] | undefined = await getChildDocs(
            srcBlock.root_id
        );
        console.log(children);
        children = children ?? [];
        return children.sort((a, b) => {
            return a.hpath.localeCompare(b.hpath);
        });
    }

    async function transferRefs() {
        // console.log(srcBlockID, dstBlockID, refChoose);
        if (refChoose.length === 0) {
            showMessage(i18n.msg.NoRefChoose);
            return;
        }
        //确认一下目标块存在
        let sql = `select * from blocks where id = "${dstBlockID}" limit 1`;
        let result: Block[] = await api.sql(sql);
        if (isnot(result)) {
            showMessage(i18n.msg.NoDst.replace("${dstBlockID}", dstBlockID));
            return;
        }
        api.transferBlockRef(srcBlockID, dstBlockID, refChoose);
    }

    function showSrcBlock(blockId: BlockId, event: MouseEvent) {
        event.stopPropagation();
        console.log(event);
        plugin.addFloatLayer({
            ids: [blockId],
            x: event.clientX,
            y: event.clientY,
        });
        //@ts-ignore
        let blockPanels = window.siyuan.blockPanels;
        let panel = blockPanels[blockPanels.length - 1];
        let ele = panel.element;
        ele.style.zIndex = "999";
    }

    const type2text = (btype: string) => {
        let text = i18n.btype?.[btype];
        return text ?? btype;
    };

    let queryRefsPromise = queryRefs();
    let queryFamilyPromise = queryFamily();
</script>

<main id="main" class="fn__flex fn__flex-1">
    <section id="refs" class="fn__flex-1">
        {#await queryRefsPromise}
            <p>查询中...</p>
        {:then refBlockInfo}
            <div class="refs-table">
                <div class="row header">
                    <div class="cell-0">
                        <input type="checkbox" bind:this={checkboxTitle} on:change={clickCheckboxTitle}/>
                    </div>
                    <div class="cell">{i18n.pannel.refs.table[0]}</div>
                    <div class="cell">{i18n.pannel.refs.table[1]}</div>
                    <div class="cell">{i18n.pannel.refs.table[2]}</div>
                    <div class="cell">{i18n.pannel.refs.table[3]}</div>
                </div>
                {#each refBlockInfo as block (block.id)}
                    <div class="row">
                        <div class="cell-0">
                            <input
                                type="checkbox"
                                value={block.id}
                                bind:group={refChoose}
                                on:change={clickCheckboxBlock}
                            />
                        </div>
                        <div
                            class="cell b3-tooltips b3-tooltips__n"
                            aria-label={block.id}
                        >
                            <span
                                on:click={(event) => {
                                    showSrcBlock(block.id, event);
                                }}
                                on:keydown={() => {}}
                            >
                                {type2text(block.type)}
                            </span>
                        </div>
                        <div class="cell">{block.notebook}</div>
                        <div class="cell">{block.doc}</div>
                        <div class="cell">{clipStr(block.content, 50)}</div>
                    </div>
                {/each}
            </div>
        {:catch error}
            <p style="color: red">找不到 {error.message}</p>
        {/await}
    </section>

    <div class="layout__resize--lr layout__resize" />

    <section id="dsts">
        <div id="transBtn">
            <div>
                <input
                    class="b3-text-field fn__flex-center"
                    bind:value={dstBlockID}
                    placeholder={i18n.pannel.transBtn.placeholder}
                />
            </div>
            <div>
                <button
                    class="b3-button b3-button--outline fn__flex-center"
                    on:click={transferRefs}
                >
                    {i18n.pannel.transBtn.btn}
                </button>
            </div>
        </div>

        <div id="dstOptions">
            <h4>{i18n.pannel.dstOptions.candidate}</h4>

            {#await queryFamilyPromise}
                <p>查询中...</p>
            {:then children}
                {#each children as block (block.id)}
                    <label>
                        <input
                            type="radio"
                            bind:group={dstChoose}
                            name="options"
                            value={block.id}
                        />
                        {block.hpath.split("/").pop()}
                    </label>
                {/each}
            {/await}
            <!-- <label>
                <input type="radio" bind:group={dstChoose} name="options" value="option1">
                Option 1
            </label> -->
        </div>
    </section>
</main>

<style lang="scss">
    #main {
        // display: flex;
        // flex-direction: row;
        font-size: 1rem;

        #refs {
            flex: 3;
            display: flex;
            flex-direction: column;
            overflow: auto;
            padding: 0.5rem;
            border: 1px solid var(--border-color);
            div.refs-table {
                .row > .cell:nth-child(2) {
                    text-align: center;
                    > span {
                        color: var(--b3-protyle-inline-link-color);
                        border-bottom: 1px solid
                            var(--b3-protyle-inline-link-color);
                    }
                }
                .row > .cell:nth-child(3) {
                    text-align: center;
                }
            }
        }

        #dsts {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 0.5rem;
            border: 1px solid var(--border-color);
            max-width: 15rem;

            > #transBtn {
                flex: 1;
                max-height: 3rem;
                display: flex;

                :nth-child(1) {
                    flex: 3;
                    margin-right: 2px;
                    > input {
                        width: 100%;
                    }
                }
                :nth-child(2) {
                    flex: 1;
                    > button {
                        width: 100%;
                    }
                }
            }

            > #dstOptions {
                flex: 3;
                overflow: auto;
                > label {
                    display: block;
                    margin: 1rem;
                }
            }
        }
    }
</style>
