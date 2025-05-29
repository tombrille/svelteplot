<script>
    import { page } from '$app/state';

    import { SVELTEPRESS_CONTEXT_KEY } from '@sveltepress/theme-default/context';
    const { isDark } = getContext(SVELTEPRESS_CONTEXT_KEY);

    import { getContext } from 'svelte';

    const pages = import.meta.glob('../**/*.svelte', { eager: true });

    const screenshots = import.meta.glob('/static/examples/**/*.png', {
        eager: true,
        import: 'default',
        query: '?url'
    });

    const indexKey = $derived(
        Object.keys(pages).find(
            (d) => d.replace(/^..\//, '').replace('/_index.svelte', '') === page.params.group
        )
    );
    const indexMod = $derived(indexKey ? pages[indexKey] : null);

    const subPages = $derived(
        Object.keys(pages).filter((d) => d.replace(/^..\//, '').startsWith(`${page.params.group}/`))
    );
</script>

{#if subPages.length}
    {#if indexKey}
        <a href="/examples">Examples</a>
        <indexMod.default />

        <div class="list">
            {#each subPages as page, i (i)}
                {#if !page.endsWith('/_index.svelte')}
                    {@const url = `/examples/${page.replace(/^..\//, './').replace('.svelte', '')}`}
                    {@const screenshotUrl = page
                        .replace(/^..\//, '/static/examples/')
                        .replace('.svelte', $isDark ? '.dark.png' : '.png')}
                    <div>
                        {#if screenshots[screenshotUrl]}
                            <a href={url}
                                ><img
                                    src={screenshots[screenshotUrl].replace('/static', '')}
                                    alt={pages[page].title} /></a
                            >{/if}
                        <h4>
                            <a href={url}>{pages[page].title}</a>
                        </h4>
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
{:else}
    <h2>Not found</h2>
{/if}

<style>
    .list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        width: 100%;
        margin: 2rem 0;
    }

    .list > div {
        display: flex;
        flex-direction: column;
        align-items: left;
        row-gap: 0.3rem;

        > a {
            border: 1px solid #88888822;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
            padding: 1.5ex;
        }

        &:hover {
            > a {
                border: 1px solid currentColor;
            }
            h4 a {
                text-decoration: underline;
            }
        }
    }

    .list img {
        width: 100%;
        box-sizing: border-box;
        border-radius: 3px;
        transition: transform 0.2s ease-in-out;
    }

    .list h4 {
        margin: 0rem;
        font-weight: normal;
        font-size: 13px;
        line-height: 1;
        > a {
            text-decoration: none;
        }
    }
</style>
