<script lang="ts">
    import type { Snippet } from "svelte";
    let { length, children, ...groupProps }: { children: Snippet, length: number } = $props();
</script>

{#if length > 1}
    <g {...groupProps}>
       {@render children()}
    </g>
{:else}
    {@render children()}
{/if}
