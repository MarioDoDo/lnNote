<script>
    import {bech32} from 'bech32'
    import {default as B} from 'buffer'
    import Share from "./Share.svelte";

    const {Buffer} = B
    export let params = {};

    let data, invoice, server, apiKey, prefix, title, type, shorted;

    if (localStorage.getItem(`info${params.record}`)) {
        let tmp = JSON.parse(localStorage.getItem(`info${params.record}`));
        data = tmp.data
        invoice = tmp.invoice;
        server = tmp.server;
        apiKey = tmp.key;
        prefix = tmp.prefix ? tmp.prefix : "";
        title = tmp.title ? tmp.title : "";
        type = tmp.type ? tmp.type : "";
        shorted = tmp.shorted ? tmp.shorted : "";
    }

    const redirectHome = (remove) => {
        if (remove) {
            localStorage.removeItem(`lnrecord${params.record}`)
            localStorage.removeItem(`info${params.record}`)
        }
        window.location.href = `/#/home/`;
    }
    const redirectManual = () => {
        window.location.href = `/#/manual/${encodeURIComponent(prefix + params.record)}/${encodeURIComponent(title)}`;
    }

    const decodeLnurl = (lnurl) => {
        try {
            let p = lnurl.split(/[:=]/)
            lnurl = p.length === 2 ? p[1] : lnurl
            let d = bech32.decode(lnurl, 1500)
            let b = bech32.fromWords(d.words)
            return Buffer.from(b).toString()
        } catch (e) {
            return `not valid LNURL - ${e}`;
        }
    }
    const encodeLnurl = (url) => {
        let words = bech32.toWords(Buffer.from(url, 'utf8'))
        return bech32.encode('lnurl', words, 1500)
    }
    const isLightningAddress = (address) => {
        if (address.split('@').length !== 2) return false;
        const splitted = address.split('@');
        return !!splitted[0].trim() && !!splitted[1].trim();
    }

    const isLnurl = (lnurl) => {
        try {
            let p = lnurl.split(/[:=]/)
            lnurl = p.length === 2 ? p[1] : lnurl
            let d = bech32.decode(lnurl, 1500)
            let b = bech32.fromWords(d.words)
            return !!Buffer.from(b).toString();
        } catch (e) {
            return false;
        }
    }
    const short = async () => {
        const res = await (await fetch("https://gotiny.cc/api", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({input: decodeLnurl(params.record)}),
        })).json()
        document.location.href = `/#/manual/${encodeLnurl(`https://gotiny.cc/${res[0].code}`)}/${encodeURIComponent(title)} - short/true`;
    }
    let addressUrl;
    const fetchLightningAddress = async (address) => {
        addressUrl = `https://${address.split("@")[1]}/.well-known/lnurlp/${address.split("@")[0]}`;
        return await (await fetch(addressUrl)).json();
    }
    const fetchLnurl = async (lnurl) => {
        return await (await fetch(decodeLnurl(lnurl))).json();
    }

    const updateUses = async () => {
        let res = (await (await fetch(`${server}/withdraw/api/v1/links/${data.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Api-Key": apiKey
            }
        })).json())
        data.used = res.used
        return res;
    }

    const deleteLNURL = async () => {
        (await (await fetch(`${server}/withdraw/api/v1/links/${data.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "X-Api-Key": apiKey
            }
        })).json())
        redirectHome(true);
    }
</script>
<main class="grid grid-rows-8 grid-cols-2 justify-center items-center">
    <div class="row-start-1 col-span-2 w-11/12 rounded-xl">
        <textarea readonly class="w-full">{decodeURIComponent(params.record)}</textarea>
    </div>

    <div class="row-start-2 col-span-2 row-span-3 w-11/12 border border-bitcoin rounded-xl gap-6 p-4 h-full items-center inline-grid grid-cols-1 overflow-y-scroll">
        <div class="overflow-x-scroll max-h-16"><h1>title: {title}</h1></div>
        <h1>prefix: {prefix}</h1>
        <h1>type: {type}</h1>
        {#if data}
            {#if type === "lnurlw"}
                {#await updateUses()}
                    <p>fetching data...</p>
                {:then update}
                    <p>used: {update.used} / {data.uses}</p>
                {/await}

                <p>id: {data.id}</p>
                <p>wallet: {data.wallet}</p>
                <p>min: {data.min_withdrawable} sats</p>
                <p>max: {data.max_withdrawable} sats</p>
                <p>wait time: {data.wait_time}</p>
                <p>decoded: <a href="{decodeLnurl(data.lnurl)}" class="text-bitcoin">{decodeLnurl(data.lnurl)}</a></p>
                {#if invoice}
                    <textarea class="w-full" readonly>invoice: {invoice}</textarea>
                {/if}
            {:else}
                <p>id: {data.id}</p>
                <p>wallet: {data.wallet}</p>
                <p>min: {data.min} sats</p>
                <p>max: {data.max} sats</p>
                <p>comment length: {data.comment_chars}</p>
                <p>decoded: <a href="{decodeLnurl(data.lnurl)}" class="text-bitcoin">{decodeLnurl(data.lnurl)}</a></p>
                {#if localStorage.getItem(`user${params.record}`)}
                    <p>link: <a class="text-bitcoin"
                                href="{server}/wallet?usr={JSON.parse(localStorage.getItem(`user${params.record}`)).data.id}">{`${server}/wallet?usr=${JSON.parse(localStorage.getItem(`user${params.record}`)).data.id}`}</a>
                    </p>
                {/if}
            {/if}
        {:else if isLightningAddress(decodeURIComponent(params.record))}
            <p>decoded: <a href="{addressUrl}" class="text-bitcoin">{addressUrl}</a></p>
            {#await fetchLightningAddress(decodeURIComponent(params.record))}
                <p>fetching data...</p>
            {:then data}
                <p>callback: <a href={data.callback} class="text-bitcoin">{data.callback}</a></p>
                <p>min: {data.minSendable / 1000} sats</p>
                <p>max: {data.maxSendable / 1000} sats</p>
                <p>comment: {data.commentAllowed ? "allowed" : "not allowed"}</p>
            {:catch err}
                <h3 class="text-center">Couldn't fetch data</h3>
            {/await}
        {:else if isLnurl(decodeURIComponent(params.record))}
            <p>decoded: <a href="{decodeLnurl(params.record)}" class="text-bitcoin">{decodeLnurl(params.record)}</a></p>
            {#await fetchLnurl(decodeURIComponent(params.record))}
                <p>fetching data...</p>
            {:then data}
                <p>callback: <a href={data.callback} class="text-bitcoin">{data.callback}</a></p>
                <p>tag: {data.tag}</p>
                <p>k1: {data.k1}</p>
                <p>min: {data.minWithdrawable || data.min}</p>
                <p>max: {data.maxWithdrawable || data.max}</p>
                <p>description: {decodeURIComponent(data.defaultDescription)}</p>
            {:catch err}
                <h3 class="text-center">Couldn't fetch data</h3>
            {/await}
        {/if}

    </div>

    <div class="row-start-5 col-start-1 col-span-2 bg-none border border-bitcoin rounded-xl w-11/12 h-16 mt-2 p-2 inline-flex items-center justify-center">
        <Share value={params.record}/>
    </div>


    <button on:click={() => redirectManual()} class="row-start-6 col-start-1 rounded-xl bg-gray-700 w-3/4 h-12">edit
    </button>
    {#if isLnurl(params.record) && shorted !== "true"}
        <button on:click={short} class="row-start-6 col-start-2 inline-grid items-center w-3/4 h-12 bg-bitcoin rounded-xl">short it</button>
    {:else}
        <button disabled on:click={short} class="row-start-6 col-start-2 inline-grid items-center w-3/4 h-12 bg-bitcoin rounded-xl opacity-30">short it</button>
    {/if}
    {#if invoice}
        <button on:click={window.location.href = `/#/payment/${invoice}/${((Number(data.uses) - Number(data.used)) * Number(data.max_withdrawable)) + (Number(data.uses) - Number(data.used) > 0 ? 5 : 0)}/${encodeURIComponent(params.record)}`}
                class="row-start-7 col-start-1 rounded-xl bg-bitcoin w-3/4 h-12 text-center">
            refill
        </button>
    {:else}
        <button disabled class="row-start-7 col-start-1 rounded-xl bg-bitcoin w-3/4 h-12 text-center opacity-30">
            refill
        </button>
    {/if}
    {#if apiKey && server}
        <button on:click={deleteLNURL} class="row-start-7 col-start-2 rounded-xl bg-red-900 w-3/4 h-12">
            delete
        </button>
    {:else}
        <button on:click={() => redirectHome(true)} class="row-start-7 col-start-2 rounded-xl bg-red-900 w-3/4 h-12">
            delete
        </button>
    {/if}

    <button on:click={()=>document.location.href = "/#/home"} class="row-start-8 col-span-2 w-full h-full bg-bitcoin">
        DONE
    </button>
</main>