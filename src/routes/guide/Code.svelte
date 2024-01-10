<script>
    import HighlightSvelte from 'svelte-highlight/HighlightSvelte.svelte';
    import atomOneLight from 'svelte-highlight/styles/github';

    let { code = '', repl = null } = $props();
</script>

<svelte:head>
    {@html atomOneLight}
</svelte:head>

<div class="block">
    {#if repl}<a class="repl" href={repl}>repl</a>{/if}
    <HighlightSvelte {code} />
</div>

<style>
    div :global(pre) {
        padding: 0;
        background-color: #f6f6f7;
        border-radius: 6px !important;
    }
    div :global(code) {
        background-color: #f6f6f7;
        padding: 1.5rem !important;
    }
    .block {
        position: relative;
    }
    .repl {
        position: absolute;
        top: 1ex;
        right: 1em;
        font-size: 12px;
        text-transform: uppercase;
    }
</style>
