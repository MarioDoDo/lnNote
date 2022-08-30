<script>
    import QRCode from 'qrcode';
    import {onMount} from "svelte";

    export let params = {};

    onMount(() => {
        QRCode.toCanvas(document.getElementById('canvas'), decodeURIComponent(params.record), {
            width: 250,
            errorCorrectionLevel: 'H'
        }, (error) => {
            if (error) console.error(error);
        })
    })
</script>
<main class="grid grid-rows-8 justify-items-center items-center">
    <textarea class="row-start-2 w-11/12 h-full" readonly>{decodeURIComponent(params.record)}</textarea>
    <canvas id="canvas" class="row-start-4"></canvas>
    <button on:click={()=>window.history.back()} class="row-start-8 w-full h-full bg-bitcoin">
        DONE
    </button>
</main>
