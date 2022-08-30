<script>
    import {onMount} from "svelte";
    import TapNfcAnimation from "./TapNfcAnimation.svelte";

    export let params = {};

    let prefix = "";
    if (localStorage.getItem(`info${params.record}`)) {
        let tmp = JSON.parse(localStorage.getItem(`info${params.record}`));
        prefix = tmp.prefix;
    }
    let writeTag = () => {
    };
    let ndef;
    onMount(() => {
        writeTag = async () => {
            if (!ndef) {
                if ("NDEFReader" in window) {
                    ndef = new window.NDEFReader();
                    try {
                        if (prefix) {
                            await ndef.write({
                                records: [{
                                    recordType: "url",
                                    data: `${prefix.replace("://", "")}://${decodeURIComponent(params.record)}`
                                }]
                            });
                        } else {
                            await ndef.write(decodeURIComponent(params.record));
                        }
                        document.getElementById("error").innerText = "";
                    } catch (error) {
                        alert(error);
                        ndef = null;
                    }
                }
            }
        };
    });
</script>
<main class="grid items-center justify-items-center w-full h-full">
    <textarea class="row-start-1 w-11/12 h-24" readonly>{decodeURIComponent(params.record)}</textarea>
    <input bind:value={prefix} placeholder="prefix (lightning://)" class="w-11/12 h-1/2 rounded-xl">
    <button on:click={writeTag} class="bg-bitcoin w-1/2 h-1/2 rounded-xl">write</button>

    {#if "NDEFReader" in window}
        {#if ndef}
            <div class="grid items-center justify-items-center text-center">
                <span id="error" class="text-red-700"></span>
                <h1>Tap NFC tag to write</h1>
                <div class="w-1/4 mt-4">
                    <TapNfcAnimation/>
                </div>
            </div>
        {:else}
            <h1 class="row-start-4">tap write to start</h1>
        {/if}
    {:else}
        <h1>NFC is not supported in your browser/device</h1>
    {/if}
    <button on:click={()=>window.history.back()} class="row-start-6 w-full h-full bg-bitcoin">
        DONE
    </button>
</main>