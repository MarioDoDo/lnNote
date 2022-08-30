<script>
    import {bech32} from 'bech32'
    import {default as B} from 'buffer'
    import Share from "./Share.svelte";

    const {Buffer} = B

    export let params = {text: "", io: ""}

    let input = "";
    let output = "";

    const isLightningAddress = (address) => {
        if (address.split('@').length !== 2) return false;
        const splitted = address.split('@');
        return !!splitted[0].trim() && !!splitted[1].trim();
    }

    const decodeLightningAddress = (address) => {
        return `https://${address.split("@")[1]}/.well-known/lnurlp/${address.split("@")[0]}`;
    }

    const islnurl = (s) => {
        s = input.toLowerCase()
        if (s.indexOf(':') !== -1) s = s.split(':')[1]
        return s.slice(0, 6) === 'lnurl1'
    }

    const parse = (e) => {
        e.preventDefault()
        if (islnurl(input)) {
            output = decode(input)
        } else if (isLightningAddress(input)) {
            output = decodeLightningAddress(input)
        } else {
            output = encode(input)
        }
        window.location.href = `/#/lnurl/o/${encodeURIComponent(output)}`;
    }

    const decode = (lnurl) => {
        let p = lnurl.split(/[:=]/)
        lnurl = p.length === 2 ? p[1] : lnurl
        let d = bech32.decode(lnurl, 1500)
        let b = bech32.fromWords(d.words)
        return Buffer.from(b).toString()
    }

    const encode = (url) => {
        let words = bech32.toWords(Buffer.from(url, 'utf8'))
        return bech32.encode('lnurl', words, 1500)
    }

    let data = "";
    const fetchLnurl = async () => {
        data = await fetch(output).then(res => res.text())
    }
    const paste = async () => {
        input = await navigator.clipboard.readText();
    }

    if (params.io === "i") {
        input = params.text.split("://")[1] ? params.text.split("://")[1] : params.text;
        if (islnurl(input)) {
            output = decode(input)
        } else if (isLightningAddress(input)) {
            output = decodeLightningAddress(input)
        } else {
            output = encode(input)
        }
    } else if (params.io === "o") {
        output = params.text.split("://")[1] ? params.text.split("://")[1] : params.text;
        if (islnurl(output)) {
            input = decode(output);
        } else if (isLightningAddress(output)) {
            input = decodeLightningAddress(output)
        } else {
            input = decode(output);
        }
    }
</script>
<main class="grid grid-rows-10 items-center justify-items-center">
    <div class="row-start-1 border border-bitcoin w-11/12 h-1/2 rounded-xl p-2 inline-grid grid-cols-3 gap-4 items-center justify-items-center">
        <button on:click={paste} class="w-6"><img alt="paste" src="paste.svg"/></button>
        <a href="/#/qr/decoder" class="w-6"><img alt="qr" src="qr.svg"/></a>
        <a href="/#/nfc/decoder" class="w-6"><img alt="nfc" src="nfc.svg"/></a>
    </div>
    <input bind:value={input} on:input={parse} class="row-start-2 w-11/12 h-3/4 overflow-x-scroll rounded-xl border border-bitcoin p-2"
           placeholder="input ulr/lnurl/ln address">
    <input readonly bind:value={output} on:input={parse}
           class="row-start-3 w-11/12 h-3/4 overflow-x-scroll rounded-xl border border-bitcoin p-2" placeholder="output">
    <div class="row-start-4 border border-bitcoin w-11/12 h-1/2 rounded-xl p-2">
        <Share value={output}/>
    </div>

    <button on:click={fetchLnurl} class="row-start-5 bg-bitcoin rounded-xl w-11/12 h-1/2">fetch data</button>
    <textarea class="row-start-6 row-span-3 w-11/12 h-3/4">{data}</textarea>
    <button on:click={()=>window.location.href = "/#/home"} class="row-start-10 w-full h-full bg-bitcoin">
        DONE
    </button>
</main>