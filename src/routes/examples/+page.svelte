<script module>
    export const frontmatter = {
        title: 'Example plots',
        description: 'Some description'
    };
</script>

<script>
    import { groupBy } from 'es-toolkit';

    const pages = import.meta.glob('./**/*.svelte', { eager: true });
    const paths = groupBy(
        Object.keys(pages).filter((d) => !d.startsWith('./[group]')),
        (d) => d.split('/')[1]
    );
</script>

<div class="column-container">
    {#each Object.entries(paths) as [group, groupPages] (group)}
        <div>
            <h3><a href="/examples/{group}">{pages[groupPages[0]].title}</a></h3>
            <ul>
                {#each groupPages.slice(1) as page (page)}
                    <li>
                        <a href={page.replace('./', 'examples/').replace('.svelte', '')}
                            >{pages[page].title}</a>
                    </li>
                {/each}
            </ul>
        </div>
    {/each}
</div>

<style>
    .column-container {
        columns: 2;
        column-gap: 1rem;
        column-fill: balance;
        > div {
            padding-top: 1em;
            break-before: column;
        }
        h3 {
            break-before: avoid-column;
        }
    }
</style>
