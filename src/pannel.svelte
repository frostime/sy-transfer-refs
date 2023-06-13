<script lang="ts">
    import { sql } from "./api";

    export let srcBlockID: BlockId;
    let dstChoose: string = "";

    async function queryRefs() {
        let sqlQuery = `select * from blocks where id in (
        select block_id from refs where def_block_id = '${srcBlockID}') order by updated desc`;
        let refBlocks: Block[] = await sql(sqlQuery);
        let refBlockInfo = [];
        for (let block of refBlocks) {
            refBlockInfo.push({
                id: block.id,
                notebook: block.box,
                // doc: block.hpath.split("/").pop(),
                doc: block.hpath,
                content: block.content,
            });
        }
        return refBlockInfo;
    }

    let queryRefsPromise = queryRefs();

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
                        <div class="cell">{block.content}</div>
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
            <label>
                <input type="radio" bind:group={dstChoose} name="options" value="option1">
                Option 1
            </label>
            <label>
                <input type="radio" bind:group={dstChoose} name="options" value="option2">
                Option 2
            </label>
            <label>
                <input type="radio" bind:group={dstChoose} name="options" value="option3">
                Option 3
            </label>
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
