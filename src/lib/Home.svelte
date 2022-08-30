<script>
    import Record from "./Record.svelte";
    import Add from "./Add.svelte";
    import Menu from "./Menu.svelte";

    let filter = "all";
</script>
<main class="bg-base">
    <div class="absolute top-5 left-5">
        <img alt="logo" src="logo.svg" class="w-16 h-16"/>
    </div>

    <div class="absolute top-8 right-5">
        <Menu/>
    </div>

    <select id="filter" bind:value={filter} class="h-8 w-1/3 text-center top-24 relative rounded-xl bg-bitcoin">
        <option value="all">All</option>
        <option value="valid">Valid</option>
        <option value="lnAddress">Ln Address</option>
        <option value="lnurl">Lnurl</option>
        <option value="refill">refill</option>
    </select>

    <div id="records" class="absolute bottom-0 h-5/6 overflow-y-scroll w-11/12 flex-wrap">
        {#each Object.keys(localStorage) as value}
            {#if value.includes("lnrecord")}
                {#if filter === "all"}
                    <Record value={value.slice(8, value.length)}
                            title={JSON.parse(localStorage.getItem(value.replace("lnrecord", "info"))).title}/>
                {:else if filter === "valid"}
                    {#if (JSON.parse(localStorage.getItem(value.replace("lnrecord", "info")))).type === "lnAddress" || JSON.parse(localStorage.getItem(value.replace("lnrecord", "info"))).type === "lnurl" || JSON.parse(localStorage.getItem(value.replace("lnrecord", "info"))).type === "lnurlw" || JSON.parse(localStorage.getItem(value.replace("lnrecord", "info"))).type === "lnurlp"}
                        <Record value={value.slice(8, value.length)}
                                title={JSON.parse(localStorage.getItem(value.replace("lnrecord", "info"))).title}/>
                    {/if}
                {:else if filter === "lnAddress"}
                    {#if (JSON.parse(localStorage.getItem(value.replace("lnrecord", "info")))).type === "lnAddress"}
                        <Record value={value.slice(8, value.length)}
                                title={JSON.parse(localStorage.getItem(value.replace("lnrecord", "info"))).title}/>
                    {/if}
                {:else if filter === "lnurl"}
                    {#if (JSON.parse(localStorage.getItem(value.replace("lnrecord", "info")))).type === "lnurl" || JSON.parse(localStorage.getItem(value.replace("lnrecord", "info"))).type === "lnurlw" || JSON.parse(localStorage.getItem(value.replace("lnrecord", "info"))).type === "lnurlp"}
                        <Record value={value.slice(8, value.length)}
                                title={JSON.parse(localStorage.getItem(value.replace("lnrecord", "info"))).title}/>
                    {/if}
                {:else if filter === "refill"}
                    {#if (JSON.parse(localStorage.getItem(value.replace("lnrecord", "info")))).invoice}
                        <Record value={value.slice(8, value.length)}
                                title={JSON.parse(localStorage.getItem(value.replace("lnrecord", "info"))).title}/>
                    {/if}
                {/if}
            {/if}
        {/each}
    </div>

    <div class="absolute bottom-5 right-5">
        <Add/>
    </div>
</main>
