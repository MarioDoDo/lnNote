<script>
    export let params = {record: "", title: "", shorted: ""};

    let newRec = params.record ? decodeURIComponent(params.record) : "";
    let title = params.record ? decodeURIComponent(params.title) : "";

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

    const redirect = () => {
        if (newRec) {
            if (params.record) {
                localStorage.removeItem(`lnrecord${(getRecord(params.record))}`);
                if (localStorage.getItem(`info${getRecord(params.record)}`) && getRecord(params.record) === getRecord(newRec)) {
                    let update = JSON.parse(localStorage.getItem(`info${getRecord(params.record)}`));
                    localStorage.removeItem(`info${getRecord(params.record)}`);
                    update.title = title ? title : getRecord(newRec);
                    update.prefix = getPrefix(newRec);
                    update.type = getType(getRecord(newRec));
                    localStorage.setItem(`info${encodeURIComponent(getRecord(newRec))}`, JSON.stringify(update));
                } else {
                    localStorage.removeItem(`info${getRecord(params.record)}`);
                    localStorage.setItem(`info${encodeURIComponent(getRecord(newRec))}`, JSON.stringify({
                        title: title ? title : getRecord(newRec),
                        prefix: getPrefix(newRec),
                        type: getType(getRecord(newRec)),
                        shorted: params.shorted ? params.shorted : "false"
                    }));
                }
            } else {
                localStorage.setItem(`info${encodeURIComponent(getRecord(newRec))}`, JSON.stringify({
                    title: title ? title : getRecord(newRec),
                    prefix: getPrefix(newRec),
                    type: getType(getRecord(newRec)),
                    shorted: params.shorted ? params.shorted : "false"
                }));
            }


            localStorage.setItem(`lnrecord${encodeURIComponent(getRecord(newRec))}`, newRec);
            document.location.href = `/#/manage/${encodeURIComponent(encodeURIComponent(getRecord(newRec)))}`;

        } else {
            document.location.href = `/#/home`;
        }
    }
    const paste = async () => {
        newRec = await navigator.clipboard.readText();
    }
</script>
<main>
    <div class="grid grid-rows-7 items-center justify-items-center w-full h-full">
        <button on:click={()=>window.history.back()} class="justify-self-start"><img alt="back" src="paste.svg" class="row-start-2 col-start-1 w-8 h-8 rotate-90"/></button>
        <input bind:value={title} placeholder="title" class="row-start-3 w-11/12 h-full rounded-xl">
        <div class="row-span-2 row-start-5 w-11/12 h-full items-center justify-items-center inline-grid grid-rows-2">
            <input bind:value={newRec} placeholder="lnurl/ln address/rpc" class="w-full h-full rounded-xl">
            <button on:click={paste}><img class="w-6" alt="paste" src="paste.svg"/></button>
        </div>
        <button on:click={redirect} class="row-start-7 w-full h-full bg-bitcoin">DONE</button>
    </div>
</main>