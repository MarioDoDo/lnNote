<script>
    import {Html5Qrcode} from "html5-qrcode"
    import {onMount} from "svelte";

    export let params = {save: ""}

    let html5QrCode;
    let newRec = "";
    let title = "";

    let read = () => {
    };
    onMount(() => {
        read = async () => {
            newRec = "";
            html5QrCode = new Html5Qrcode("reader");
            const qrCodeSuccessCallback = async (decodedText) => {
                newRec = decodedText;
            };
            const config = {fps: 30, qrbox: {width: 200, height: 200}};

            html5QrCode.start({facingMode: "environment"}, config, qrCodeSuccessCallback);
        }
        read();
    });

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
        await html5QrCode.stop();
        html5QrCode = null;
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
<main class="grid items-center justify-items-center h-full w-full">
    <textarea class="mt-6 w-11/12 h-16" readonly>{newRec}</textarea>
    <input bind:value={title} placeholder="title" class="row-start-2 w-11/12 h-full rounded-xl">
    <div class="w-64 h-64">
        <div id="reader"></div>
    </div>
    <span id="error"></span>
    <button on:click={redirect} class="w-full h-full bg-bitcoin">DONE</button>
</main>
