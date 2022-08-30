<script>
    import {onMount} from "svelte";
    import TapNfcAnimation from "./TapNfcAnimation.svelte";

    export let params = {save: ""}

    let newRec = "";
    let title = "";
    let read = () => {
    };
    onMount(() => {
        read = async () => {
            newRec = "";
            if ("NDEFReader" in window) {
                const ndef = new window.NDEFReader();
                try {
                    await ndef.scan();
                    ndef.onreading = event => {
                        const decoder = new TextDecoder();
                        let tmp = "";
                        for (const record of event.message.records) {
                            tmp = decoder.decode(record.data);
                        }
                        newRec = tmp;
                    }
                } catch (error) {
                    alert(error)
                    await read();
                }
            }
        }
        read();
    })

    const getPrefix = (str) => {
        return str.split("://")[1] ? str.split("://")[0] + "://" : "";
    }
    const getRecord = (str) => {
        return str.split("://")[1] ? str.split("://")[1] : str;
    }
    const isLnurl = (s) => {
        s = s.toLowerCase()
        if (s.indexOf(':') !== -1) s = s.split(':')[1]
        return s.slice(0, 6) === 'lnurl1'
    }

    const isLightningAddress = (address) => {
        if (address.split('@').length !== 2) return false;
        const splitted = address.split('@');
        return !!splitted[0].trim() && !!splitted[1].trim();
    }

    const getType = (str) => {
        return isLnurl(str) ? 'lnurl' : isLightningAddress(str) ? 'lnAddress' : 'unknown';
    }

    const redirect = async () => {
        if (params.save === "decoder") {
            if(newRec){
                document.location.href = `/#/lnurl/${newRec}`;
                return;
            }else{
                window.history.back();
                return;
            }
        }else if (params.save === "shorter") {
            if(newRec){
                document.location.href = `/#/shorter/${newRec}`;
                return;
            }else{
                window.history.back();
                return;
            }
        }
        if (newRec) {
            localStorage.setItem(`lnrecord${encodeURIComponent(getRecord(newRec))}`, getRecord(newRec));
            localStorage.setItem(`info${encodeURIComponent(getRecord(newRec))}`, JSON.stringify({
                title: title ? title : getRecord(newRec),
                prefix: getPrefix(newRec),
                type: getType(getRecord(newRec))
            }));
            document.location.href = `/#/manage/${encodeURIComponent(encodeURIComponent(getRecord(newRec)))}`;
        } else {
            document.location.href = `/#/home`;
        }
    }
</script>
<main class="grid items-center justify-items-center w-full h-full grid-rows-6">
    <textarea class="w-11/12 h-1/2" readonly>{newRec}</textarea>
    <input bind:value={title} placeholder="title" class="row-start-2w-11/12 h-1/2 rounded-xl">
    {#if "NDEFReader" in window}
        <div class="grid row-start-4 items-center justify-items-center text-center">
            <h1>Tap NFC tag to read</h1>
            <div class="w-1/4 mt-4">
                <TapNfcAnimation/>
            </div>
        </div>
    {:else}
        <h1>NFC is not supported in your browser/device</h1>
    {/if}
    <button on:click={redirect} class="row-start-6 w-full h-full bg-bitcoin">DONE</button>
</main>
