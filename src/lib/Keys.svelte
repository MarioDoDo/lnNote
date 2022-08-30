<script>
    import {onMount} from "svelte";

    onMount(() => {
        Object.keys(localStorage).filter(key => key.startsWith("user")).forEach((key) => {
            let keyData = JSON.parse(localStorage.getItem(key));
            document.getElementById("keys").innerHTML += `<div class="border border-bitcoin p-4 rounded-xl w-11/12 mt-4 select-text">server: ${keyData.server}<br>title: ${keyData.title}<br>
user id: ${keyData.data.id}<br>
wallet id: ${keyData.data.wallets[0].id}<br>
invoice key: ${keyData.data.wallets[0].inkey}<br>
admin key: ${keyData.data.wallets[0].adminkey}<br>
link: <a class="text-bitcoin" href="${keyData.server}/wallet?usr=${keyData.data.id}">${keyData.server}/wallet?usr=${keyData.data.id}<a/></p>
<button class="bg-red-500 rounded-xl w-1/4 h-full" onclick="localStorage.removeItem('${key}')">delete</button>`;
        })
    })

</script>
<main class="grid grid-rows-12 h-full justify-items-center items-center">
    <div id="keys"
         class="row-start-1 row-span-11 overflow-y-scroll w-full h-full grid items-center justify-items-center"></div>
    <button on:click={()=>document.location.href = "/#/home"} class="row-start-12 w-full h-full bg-bitcoin">DONE
    </button>
</main>