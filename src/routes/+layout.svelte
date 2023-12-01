<script lang="ts">
    import '../app.scss';
    import Nav from './nav.svelte';
    import type { Datasets } from '$lib/types';
    import { setContext } from 'svelte';

    const { data } = $props<Datasets>();

    let nav = $state(new Nav());

    setContext('data', data);
</script>

<svelte:head></svelte:head>

<div class="container">
    <div class="columns">
        <div class="column is-3">
            <aside class="menu">
                <p class="menu-label">Marks</p>
                <ul class="menu-list">
                    {#each nav.pages as page}
                        <li><a data-sveltekit-reload href={page.url}>{page.title}</a></li>
                    {/each}
                </ul>
            </aside>
        </div>
        <div class="column is-8">
            <slot />
        </div>
    </div>
</div>

<style>
    :root {
        --system-ui: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
            'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    }

    :global(body) {
        font-family: var(--system-ui);
    }
</style>
