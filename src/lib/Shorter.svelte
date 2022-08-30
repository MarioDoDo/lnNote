<script>
    import {bech32} from 'bech32'
    import {default as B} from 'buffer'
    import Share from "./Share.svelte";

    const {Buffer} = B

    export let params = {i: "", o: ""}

    let input = "";
    let output = "";

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

    const short = async () => {
        const res = await (await fetch("https://gotiny.cc/api", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({input: decode(input)}),
        })).json()
        output = encode(`https://gotiny.cc/${res[0].code}`)
        changeUrl();
    }
    const changeUrl = () => {
        if(input){
            window.location.href = `/#/shorter/${encodeURIComponent(input)}/${encodeURIComponent(output)}`;
        }else{
            window.location.href = `/#/shorter`;
        }
    }
    const paste = async () => {
        input = await navigator.clipboard.readText();
    }

    if (params.i) {
        input = params.i.split("://")[1] ? params.i.split("://")[1] : params.i
    }
    if(params.o){
        output = params.o.split("://")[1] ? params.o.split("://")[1] : params.o;
    }

</script>
<main class="grid grid-rows-12 items-center justify-items-center">
    <div class="row-start-1 row-span-2 border border-bitcoin w-11/12 h-1/2 rounded-xl p-2 inline-grid grid-cols-3 gap-4 items-center justify-items-center">
        <button on:click={paste} class="w-6"><img alt="paste" src="paste.svg"/></button>
        <a href="/#/qr/shorter" class="w-6"><img alt="qr" src="qr.svg"/></a>
        <a href="/#/nfc/shorter" class="w-6"><img alt="nfc" src="nfc.svg"/></a>
    </div>
    <input bind:value={input} on:input={changeUrl}
           class="row-start-3 row-span-2 w-11/12 h-3/4 overflow-x-scroll rounded-xl border border-bitcoin p-2"
           placeholder="long lnurl">
    <button on:click={short} class="row-start-5 row-span-2 bg-bitcoin rounded-xl w-11/12 h-1/2">short it</button>
    <input readonly bind:value={output}
           class="row-start-7 row-span-2 w-11/12 h-3/4 overflow-x-scroll rounded-xl border border-bitcoin p-2"
           placeholder="short lnurl">
    <div class="row-start-9 row-span-2 border border-bitcoin w-11/12 h-1/2 rounded-xl p-2">
        <Share value={output}/>
    </div>
    <div class="inline-grid items-center w-1/2 h-1/2 bg-bitcoin rounded-xl text-center"><a href="/#/manual/{output}/shortLNURL/true">save</a></div>
    <button on:click={()=>window.location.href = "/#/home"} class="row-start-12 w-full h-full bg-bitcoin">
        DONE
    </button>
</main>