<script>
    export let params = {where: "trusted", lnurl: "lnurlw"};

    const backendServer = "https://qnjqpt.deta.dev/user";
    const appLnbits = "https://legend.lnbits.com";

    const trusted = () => {
        document.getElementById('trusted').style.opacity = "1";
        document.getElementById('hosted').style.opacity = "0.6";
        window.location.href = `/#/new/trusted/${params.lnurl}`;
    }
    const self = () => {
        document.getElementById('trusted').style.opacity = "0.6";
        document.getElementById('hosted').style.opacity = "1";
        window.location.href = `/#/new/self/${params.lnurl}`;
    }
    const lnurlw = () => {
        document.getElementById('lnurlw').style.opacity = "1";
        document.getElementById('lnurlp').style.opacity = "0.6";
        window.location.href = `/#/new/${params.where}/lnurlw`;
    }
    const lnurlp = () => {
        document.getElementById('lnurlp').style.opacity = "1";
        document.getElementById('lnurlw').style.opacity = "0.6";
        window.location.href = `/#/new/${params.where}/lnurlp`;
    }

    let server, title, min, max, uses, waitTime, apiKey, maxChars;

    if (params.where === "trusted") {
        server = appLnbits;
    }

    let userInfo = "";
    const createUser = async () => {
        const res = await (await fetch(backendServer, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                wallet_name: title,
                user_name: title,
            })
        })).json();
        userInfo = JSON.stringify({
            data: res,
            server: server,
            title: title,
        });
        apiKey = res.wallets[0].adminkey;
        if (params.lnurl === "lnurlw") {
            await createInvoice(true);
        } else {
            await createLNURLp(true);
        }
    }

    const createInvoice = async (newUser) => {
        const res = await (await fetch(`${server}/api/v1/payments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": apiKey
            },
            body: JSON.stringify({
                out: false,
                amount: (max * uses) + 5,
                memo: "lnurl",
                unit: "sat",
            })
        })).json();
        await createLNURLw(res.payment_request, (max * uses) + 5, newUser);
    }

    const createLNURLw = async (invoice, sats, newUser) => {
        const res = await (await fetch(`${server}/withdraw/api/v1/links`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": apiKey
            },
            body: JSON.stringify({
                title: encodeURIComponent(title),
                min_withdrawable: min,
                max_withdrawable: max,
                uses: uses,
                wait_time: waitTime,
                is_unique: false,
            })
        })).json();
        if (invoice) {
            localStorage.setItem(`lnrecord${encodeURIComponent(res.lnurl)}`, res.lnurl);
            localStorage.setItem(`info${encodeURIComponent(res.lnurl)}`, JSON.stringify({
                data: res,
                key: apiKey,
                invoice: invoice,
                title: title,
                server: server,
                type: "lnurlw",
                prefix: "lnurlw://"
            }));
            if (params.where === "trusted" && newUser) {
                localStorage.setItem(`user${encodeURIComponent(res.lnurl)}`, userInfo);
            }
            document.location.href = `/#/payment/${encodeURIComponent(invoice)}/${sats}/${encodeURIComponent(res.lnurl)}`;
        } else {
            window.history.back();
        }
    }
    const createLNURLp = async (newUser) => {
        const res = await (await fetch(`${server}/lnurlp/api/v1/links`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": apiKey
            },
            body: JSON.stringify({
                description: encodeURIComponent(title),
                min: min,
                max: max,
                wait_time: waitTime,
                comment_chars: maxChars,
            })
        })).json();
        if (res.lnurl) {
            localStorage.setItem(`lnrecord${encodeURIComponent(res.lnurl)}`, res.lnurl);
            localStorage.setItem(`info${encodeURIComponent(res.lnurl)}`, JSON.stringify({
                data: res,
                key: apiKey,
                title: title,
                server: server,
                type: "lnurlp",
                prefix: "lnurlp://"
            }));
            if (params.where === "trusted" && newUser) {
                localStorage.setItem(`user${encodeURIComponent(res.lnurl)}`, userInfo);
            }
            document.location.href = `/#/manage/${encodeURIComponent(res.lnurl)}`;
        } else {
            window.history.back();
        }
    }
</script>
<main class="w-screen">
    <div class="grid grid-cols-8 grid-rows-9 justify-center justify-items-center items-center w-full h-full">
        <a href="/#/home"><img alt="back" src="paste.svg" class="row-start-1 col-start-1 w-8 h-8 rotate-90"/></a>
        <div class="col-start-1 col-span-8 row-start-2 w-3/4 text-center">
            <button id="trusted" class="bg-bitcoin w-1/2 rounded-l-xl h-12 float-left" on:click={trusted}>TRUSTED
            </button>
            <button id="hosted" class="bg-bitcoin w-1/2 rounded-r-xl h-12 opacity-60" on:click={self}>SELF HOSTED
            </button>
        </div>
        <div class="col-start-1 col-span-8 row-start-3 w-3/4 text-center">
            <button id="lnurlw" class="bg-bitcoin w-1/2 rounded-l-xl h-12 float-left" on:click={lnurlw}>LNURLW
            </button>
            <button id="lnurlp" class="bg-bitcoin w-1/2 rounded-r-xl h-12 opacity-60" on:click={lnurlp}>LNURLP
            </button>
        </div>
        {#if params.where === "trusted"}
            <select bind:value={apiKey} class="row-start-4 col-start-1 col-span-8 w-3/4 h-8 rounded-xl bg-bitcoin">
                <option value="">new user</option>
                {#each Object.keys(localStorage).filter(key => key.startsWith("user")) as key}
                    <option value={JSON.parse(localStorage.getItem(key)).data.wallets[0].adminkey}>{JSON.parse(localStorage.getItem(key)).title} - {JSON.parse(localStorage.getItem(key)).data.wallets[0].adminkey}</option>
                {/each}
            </select>
        {/if}
        {#if params.where === "self"}
            <input bind:value={server} placeholder="lnbits server url"
                   class="row-start-4 col-span-8 w-3/4 h-16 rounded-xl">
        {/if}
        <input bind:value={title} placeholder="title / description"
               class="row-start-5 col-span-8 w-3/4 h-16 rounded-xl">
        <input bind:value={min} placeholder="min" class="row-start-6 col-span-4 w-3/4 h-16 rounded-xl">
        <input bind:value={max} placeholder="max" class="row-start-6 col-span-4 w-3/4 h-16 rounded-xl">
        {#if params.lnurl === "lnurlw"}
            <input bind:value={uses} placeholder="uses" class="row-start-7 col-span-4 w-3/4 h-16 rounded-xl">
            <input bind:value={waitTime} placeholder="wait time" class="row-start-7 col-span-4 w-3/4 h-16 rounded-xl">
        {:else}
            <input bind:value={maxChars} placeholder="max comment length"
                   class="row-start-7 col-span-8 w-3/4 h-16 rounded-xl">
        {/if}
        {#if params.where === "self"}
            <input bind:value={apiKey} placeholder="API key" class="row-start-8 col-span-8 w-3/4 h-16 rounded-xl">
        {/if}
        {#if params.where === "self"}
            {#if params.lnurl === "lnurlw"}
                <button on:click={() => {if(server && title && min && max && uses && waitTime && apiKey){createInvoice()}}}
                        class="row-start-9 col-span-8 w-full h-full bg-bitcoin">
                    NEXT
                </button>
            {:else}
                <button on:click={() => {if(server && title && min && max && maxChars && apiKey){createLNURLp()}}}
                        class="row-start-9 col-span-8 w-full h-full bg-bitcoin">
                    DONE
                </button>
            {/if}
        {:else}
            {#if params.lnurl === "lnurlw"}
                {#if apiKey}
                    <button on:click={() => {if(server && title && min && max && uses && waitTime){createInvoice(false)}}}
                            class="row-start-9 col-span-8 w-full h-full bg-bitcoin">
                        NEXT
                    </button>
                {:else}
                    <button on:click={() => {if(server && title && min && max && uses && waitTime){createUser()}}}
                            class="row-start-9 col-span-8 w-full h-full bg-bitcoin">
                        NEXT
                    </button>
                {/if}
            {:else}
                {#if apiKey}
                    <button on:click={() => {if(server && title && min && max && maxChars){createLNURLp(false)}}}
                            class="row-start-9 col-span-8 w-full h-full bg-bitcoin">
                        DONE
                    </button>
                {:else}
                    <button on:click={() => {if(server && title && min && max && maxChars){createUser()}}}
                            class="row-start-9 col-span-8 w-full h-full bg-bitcoin">
                        DONE
                    </button>
                {/if}
            {/if}
        {/if}
    </div>
</main>