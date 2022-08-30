<script>
    import Router, {location, link} from 'svelte-spa-router';
    import New from "./lib/New.svelte";
    import Home from "./lib/Home.svelte";
    import Nfc from "./lib/Nfc.svelte";
    import NotFound from "./lib/NotFound.svelte";
    import Manual from "./lib/Manual.svelte";
    import Manage from "./lib/Manage.svelte";
    import Qr from "./lib/Qr.svelte";
    import QrOut from "./lib/QrOut.svelte";
    import NfcOut from "./lib/NfcOut.svelte";
    import Keys from "./lib/Keys.svelte";
    import Lnurl from "./lib/Lnurl.svelte";
    import Payment from "./lib/Payment.svelte";
    import Shorter from "./lib/Shorter.svelte";
</script>

<Router routes={{
    "/": Home,
    "/home/": Home,
    "/home/": Home,
    "/new/:where/:lnurl": New,
    "/payment/:invoice/:sats/:record": Payment,
    "/nfc/:save?": Nfc,
    "/nfcout/:record": NfcOut,
    "/qr/:save?": Qr,
    "/qrout/:record": QrOut,
    "/manual/:record?/:title?/:shorted?": Manual,
    "/manage/:record": Manage,
    "/keys": Keys,
    "/lnurl/:io?/:text?": Lnurl,
    "/shorter/:i?/:o?": Shorter,
    "*": NotFound
}}/>
