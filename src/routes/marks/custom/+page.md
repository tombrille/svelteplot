---
title: Custom marks
---

You can arrange custom HTML elements in the plot using the `CustomMarkHTML` mark (name subject to change)


```svelte live
<script>
    import { Plot, Dot, CustomMarkHTML } from '$lib';
    import { page } from '$app/stores';
    let { penguins } = $derived($page.data.data);
</script>

<Plot grid>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species"
        symbol="species"
    />
    {#snippet overlay()}
    <CustomMarkHTML 
        data={penguins} 
        x="culmen_length_mm" 
        y="culmen_depth_mm" 
        let:datum>
        <div style="width:80px;height: 2em;position:absolute;top:-1em;left:-40px; text-align:center">
            {datum.species}
        </div>
    </CustomMarkHTML>
    {/snippet}

</Plot>
```

```svelte
<Plot grid>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species"
        symbol="species"
    />
    {#snippet overlay()}
    <CustomMarkHTML data={penguins} x="culmen_length_mm" y="culmen_depth_mm" let:datum>
        <div style="width:80px;height: 2em;position:absolute;top:-1em;left:-40px; text-align:center">
            {datum.species}
        </div>
    </CustomMarkHTML>
    {/snippet}

</Plot>
```