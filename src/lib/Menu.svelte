<script>
    const openNav = () => {
        document.getElementById("sideNav").style.width = "250px";
        document.querySelectorAll("#sideNav *").forEach(el => el.style.display = "inline-grid")
    }

    const closeNav = () => {
        document.getElementById("sideNav").style.width = "0";
        document.querySelectorAll("#sideNav *").forEach(el => el.style.display = "none")
    }
    let fileVar = {};
    const importRecords = async () => {
        let toImport = JSON.parse(await fileVar[0].text());
        Object.keys(toImport).forEach(key => {
            if (!Object.keys(localStorage).includes(key)) {
                localStorage.setItem(key, toImport[key]);
            }
        });
        document.location.reload();
    }
</script>

<div id="sideNav"
     class="fixed grid grid-cols-2 grid-rows-5 items-center justify-items-center gap-4 z-50 w-0 top-0 right-0 bg-[#1a1a1a] overflow-hidden h-full pt-24 duration-200 text-center">
    <button class="absolute top-5 right-5 text-6xl" on:click={closeNav}>&times;</button>
    <div class="col-span-2 items-center justify-items-center border border-bitcoin rounded-xl h-12 w-3/4"><a
            href="/#/keys">lnbits api keys</a></div>
    <div class="col-span-2 items-center justify-items-center border border-bitcoin rounded-xl h-12 w-3/4"><a
            href="/#/shorter">lnurl shorter</a></div>
    <div class="col-span-2 items-center justify-items-center border border-bitcoin rounded-xl h-12 w-3/4"><a
            href="/#/lnurl/">lnurl decoder</a></div>
    <a class="row-start-5 col-start-1 border border-bitcoin rounded-xl w-3/4"
       href="data:text/json;charset=utf-8,{encodeURIComponent(JSON.stringify(localStorage))}"
       download="lnnote_export.json">export</a>
    <label for="import" class="row-start-5 col-start-2 border border-bitcoin rounded-xl w-3/4">
        import
    </label>
    <input
            id="import" class="invisible" type="file" accept=".json"
            bind:files={fileVar} on:change={importRecords}/>
    <span class="absolute bottom-2">version@0.0.1</span>
</div>


<img alt="menu" src="menu.svg" class="w-10 h-10" on:click={openNav}/>

