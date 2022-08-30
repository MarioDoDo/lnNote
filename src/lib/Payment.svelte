<script>
    import QRCode from 'qrcode';
    import {onMount} from "svelte";
    import Share from "./Share.svelte";

    export let params = {invoice: "", sats: "", record: ""};

    onMount(() => {
        QRCode.toCanvas(document.getElementById('canvas'), decodeURIComponent(params.invoice), {
            width: 250,
            errorCorrectionLevel: 'H'
        }, (error) => {
            if (error) console.error(error);
        })
    })
</script>
<main class="grid grid-rows-8 justify-items-center items-center">
    <h3 class="row-start-1 text-xl">Pay invoice to fill LNURL</h3>
    <textarea class="row-start-2 h-full w-11/12 w-full" readonly>{decodeURIComponent(params.invoice)}</textarea>
    <canvas id="canvas" class="row-start-4"></canvas>
    <h3 class="row-start-6 text-3xl">max {params.sats} sats</h3>
    <div class="row-start-7 bg-none border border-bitcoin rounded-xl w-11/12 h-16 mt-2 p-2 inline-flex flex-wrap gap-12 items-center justify-center"><Share value="{params.invoice}" /></div>
    <button on:click={()=>document.location.href = `/#/manage/${encodeURIComponent(params.record)}`} class="row-start-8 w-full h-full bg-bitcoin">
        DONE
    </button>
</main>