<script lang="ts">
    import '../app.scss';
    import { page } from '$app/stores';
    import Nav from './nav.svelte';
    import type { Datasets } from '$lib/types.js';
    import { setContext } from 'svelte';
    import { group } from 'd3-array';

    const { data } = $props<Datasets>();

    let nav = $state(new Nav());

    setContext('data', data);
</script>

<svelte:head></svelte:head>

<div class="container mt-3">
    <div class="columns">
        <div class="column is-2">
            <div class="mb-5">
                <a class="is-size-5 has-text-weight-bold" href="/">SveltePlot </a>
            </div>

            <aside class="menu">
                {#each nav.pageGroups as group}
                    <hr />
                    <p class="menu-label">{group.title}</p>
                    <ul class="menu-list">
                        {#each group.pages as navItem}
                            <li>
                                <a
                                    class:is-active={navItem.url === $page.url.pathname}
                                    data-sveltekit-reload
                                    href={navItem.url}>{navItem.title}</a
                                >
                            </li>
                        {/each}
                    </ul>
                {/each}
            </aside>
        </div>
        <div class="column is-10">
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

    .menu-label {
        text-transform: none;
        font-weight: bold;
    }

    .menu-list li a {
        font-weight: 500;
        font-size: 0.9rem;
        color: #777;
    }

    .menu-list li a.is-active {
        color: #222;
    }
</style>
