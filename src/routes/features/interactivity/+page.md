---
title: Interactivity
---

Svelte makes interactive plots a lot easier!

## Custom HTML tooltips

```svelte live
<script>
    import { getContext } from 'svelte';
    import { Plot, Dot, HTMLTooltip } from '$lib';

    const { penguins } = getContext('data');

    const speciesImages = {
        Adelie: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Hope_Bay-2016-Trinity_Peninsula%E2%80%93Ad%C3%A9lie_penguin_%28Pygoscelis_adeliae%29_04.jpg/346px-Hope_Bay-2016-Trinity_Peninsula%E2%80%93Ad%C3%A9lie_penguin_%28Pygoscelis_adeliae%29_04.jpg',
        Chinstrap: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/A_chinstrap_penguin_%28Pygoscelis_antarcticus%29_on_Deception_Island_in_Antarctica.jpg/201px-A_chinstrap_penguin_%28Pygoscelis_antarcticus%29_on_Deception_Island_in_Antarctica.jpg',
        Gentoo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/00_0304_Gentoo_Penguins.jpg/160px-00_0304_Gentoo_Penguins.jpg'
    }
</script>
<Plot grid height={500} symbol={{ legend: true }} title="Penguins">
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species"
        symbol="species"
    />
    {#snippet overlay()}
    <HTMLTooltip data={penguins} let:datum x="culmen_length_mm" y="culmen_depth_mm">
      <div class="tt">
        <div>Species: {datum.species}</div>
        <div>Island: {datum.island}</div>
        <div>
            <img src={speciesImages[datum.species]}/>
        </div>
      </div>
    </HTMLTooltip>
    {/snippet}
</Plot>

<style>
    .tt { display: flex; gap: 5px; flex-direction: column }
    img { max-width: 120px; }
</style>
```