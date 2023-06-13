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

    <div id="dsts" class="fn__flex-1">yes</div>
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
            // display: flex;
            // flex-direction: column;
            overflow: auto;
            padding: 0.5rem;
            border: 1px solid var(--border-color);
            max-width: 400px;
        }
    }
</style>
