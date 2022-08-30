<script>
    import Share from "./Share.svelte";
    import {bech32} from "bech32";
    import {default as B} from 'buffer'

    const {Buffer} = B

    export let value;
    export let title;

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

    const isLightningAddress = (address) => {
        if (address.split('@').length !== 2) return false;
        const splitted = address.split('@');
        return !!splitted[0].trim() && !!splitted[1].trim();
    }
    let valid = isLnurl(decodeURIComponent(value)) || isLightningAddress(decodeURIComponent(value));

    let refill = false;
    if (localStorage.getItem(`info${value}`)) {
        if((JSON.parse(localStorage.getItem(`info${value}`))).invoice){
            refill = true;
        }
    }
</script>
<div class="inline-grid grid-cols-8 bg-none border border-bitcoin rounded-xl w-full h-16 mt-2 p-2 inline-flex flex-wrap gap-4 items-center justify-items-center">
    <div class="col-span-3 overflow-ellipsis w-full whitespace-nowrap overflow-hidden"><a
            href="/#/manage/{encodeURIComponent(value)}">{decodeURIComponent(title)}</a></div>
    {#if refill}
        <div class="w-2 h-2 rounded-full bg-green-500"></div>
    {:else if valid}
        <div class="w-2 h-2 rounded-full bg-bitcoin"></div>
    {:else}
        <div class="w-2 h-2 rounded-full bg-red-500"></div>
    {/if}
    <div class="w-full h-full col-span-4">
        <Share value={value}/>
    </div>
</div>