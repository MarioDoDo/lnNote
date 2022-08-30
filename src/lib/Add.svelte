<script>
    const toggleNav = () => {
        document.getElementById("nav").style.display = document.getElementById("nav").style.display === "flex" ? "none" : "flex";
    }
</script>
<div class="flex flex-wrap flex-col items-center">
    <div id="nav" style="display: none;" class="text-center flex flex-wrap flex-col items-center gap-4 w-full bg-base pb-2 rounded-xl">
        <a href="#/new/trusted/lnurlw" class="w-1/2"><img alt="new" src="add.svg"/></a>
        <a href="/#/manual" class="w-1/2"><img alt="manual" src="manual.svg"/></a>
        <a href="/#/qr" class="w-1/2"><img alt="qr" src="qr.svg"/></a>
        <a href="/#/nfc" class="w-1/2"><img alt="nfc" src="nfc.svg"/></a>
    </div>
    <button on:click={toggleNav} class="rounded-full w-16 h-16 bg-base"><img class="w-16 h-16" alt="new" src="add.svg"/></button>
</div>
