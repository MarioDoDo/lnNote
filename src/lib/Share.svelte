<script>
    export let value;
    const copyRecord = () => {
        navigator.clipboard.writeText(decodeURIComponent(value));
    }

    const shareRecord = () => {
        if(navigator.canShare){
            navigator.share({
                title: 'Lightning record',
                text: decodeURIComponent(value),
            })
        }
    }
</script>
<div class="bg-none inline-grid grid-cols-4 w-full h-full gap-4 items-center justify-items-center">
    <button class="w-6" on:click={copyRecord}><img alt="copy" src="copy.svg"/></button>
    <button class="w-6" on:click={shareRecord}><img alt="share" src="share.svg"/></button>
    <a href="/#/qrout/{encodeURIComponent(value)}" class="w-6"><img alt="qr" src="qr.svg"/></a>
    <a href="/#/nfcout/{encodeURIComponent(value)}" class="w-6"><img alt="nfc" src="nfc.svg"/></a>
</div>