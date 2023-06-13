<script lang="ts">
</script>

<main id="main" class="fn__flex fn__flex-1">
    <div id="refs" class="fn__flex-1">
        <div>
            <p>yes</p>
        </div>
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
            <div class="row">
                <div class="cell-0">
                    <input type="checkbox" name="" id="" />
                </div>
                <div class="cell">行1列1</div>
                <div class="cell">行1列2</div>
                <div class="cell">行1列3</div>
                <div class="cell">行1列4</div>
            </div>
            <div class="row">
                <div class="cell-0">
                    <input type="checkbox" name="" id="" />
                </div>
                <div class="cell">行2列1</div>
                <div class="cell">行2列2</div>
                <div class="cell">行2列3</div>
                <div class="cell">行2列4</div>
            </div>
        </div>
    </div>

    <div class="layout__resize--lr layout__resize" />

    <div id="dsts">

        <div id="transBtn">
            <div>
                <input
                    class="b3-text-field fn__flex-center"
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
            <div>
                <input type="radio" id="option1" name="options" value="option1">
                <label for="option1">Option 1</label>
            </div>
            <div>
                <input type="radio" id="option2" name="options" value="option2">
                <label for="option2">Option 2</label>
            </div>
            <div>
                <input type="radio" id="option3" name="options" value="option3">
                <label for="option3">Option 3</label>
            </div>
        </div>
          

    </div>
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
                >div {
                    margin-bottom: 1rem;
                }
            }

        }
    }
</style>
