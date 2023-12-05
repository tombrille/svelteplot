<script>
    import Highlight from 'svelte-highlight';
    import xml from 'svelte-highlight/languages/xml';
    //   import svelte from "svelte-highlight/languages/svelte";
    import atomOneDark from 'svelte-highlight/styles/atom-one-dark';

    let { code = '' } = $props();
</script>

<svelte:head>
    {@html atomOneDark}
</svelte:head>

<div class="block">
    <Highlight language={xml} {code} />
</div>

<style>
    div :global(pre) {
        padding: 0;
        background-color: none;
    }
</style>
