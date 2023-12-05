<script>
    import HighlightSvelte from 'svelte-highlight/HighlightSvelte.svelte';
    import atomOneLight from 'svelte-highlight/styles/github';

    let { code = '' } = $props();
</script>

<svelte:head>
    {@html atomOneLight}
</svelte:head>

<div class="block">
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
</style>
