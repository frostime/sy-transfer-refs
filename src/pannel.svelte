<script lang="ts">
    import * as api from "./api";
    import { notebookName, getChildDocs } from "@/utils";

    export let srcBlockID: BlockId;
    let dstChoose: string = "";

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
        let refBlockInfo = [];
        for (let block of refBlocks) {
            refBlockInfo.push({
                id: block.id,
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
        let children: Block[] | undefined = await getChildDocs(srcBlockID);
        console.log(children);
        children = children ?? [];
        return children.sort((a, b) => {
            return a.hpath.localeCompare(b.hpath);
        });
    }

    let queryRefsPromise = queryRefs();
    let queryFamilyPromise = queryFamily();

</script>

<main id="main" class="fn__flex fn__flex-1">
    <section id="refs" class="fn__flex-1">
        {#await queryRefsPromise}
            <p>查询中...</p>
        {:then refBlockInfo} 
            <div class="table">
                <div class="row header">
                    <div class="cell-0">
                        #
                    </div>
                    <div class="cell">ID</div>
                    <div class="cell">笔记本</div>
                    <div class="cell">文档</div>
                    <div class="cell">内容</div>
                </div>
                {#each refBlockInfo as block (block.id)}
                    <div class="row">
                        <div class="cell-0">
                            <input type="checkbox" name="" id="" />
                        </div>
                        <div class="cell">{block.id}</div>
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
                    class="b3-text-field fn__flex-center" value={dstChoose}
                />
            </div>
            <div>
                <button
                    class="b3-button b3-button--outline fn__flex-center"
                >
                    转移
                </button>
            </div>
        </div>

        <div id="dstOptions">
            <h4>候选</h4>

            {#await queryFamilyPromise}
                <p>查询中...</p>
            {:then children} 
                {#each children as block (block.id)}
                    <label>
                        <input type="radio" bind:group={dstChoose} name="options" value={block.id}>
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
        }

        #dsts {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 0.5rem;
            border: 1px solid var(--border-color);
            max-width: 400px;

            >#transBtn {
                flex: 1;
                max-height: 3rem;
                display: flex;

                :nth-child(1) {
                    flex: 3;
                    margin-right: 2px;
                    >input {
                        width: 100%;
                    }
                }
                :nth-child(2) {
                    flex: 1;
                    >button {
                        width: 100%;
                    }
                }
            }

            >#dstOptions {
                flex: 3;
                overflow: auto;
                >label {
                    display: block;
                    margin: 1rem;
                }
            }

        }
    }
</style>
