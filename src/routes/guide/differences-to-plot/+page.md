---
title: Differences to Observable Plot
---

SveltePlot is heavily inspired by Observable Plot, but in some regards it is different.

## Everything is a channel

In Observable Plot, there's a distinction between _channels_ and _non-channels_. Channels can be defined using keys or function, while the non-channels can only be assigned constant values. That means, for instance, that for the text mark, you can set the `fontSize` as a function but not the `fontWeight`.

In SveltePlot there's no such distinction and you can define almost all options either as function. The only difference is that in some cases, a _scale_ is used.

```svelte
<Plot>
    <Text data={}>
</Plot>
```

## Custom SVG

You can nest and combine marks with regular SVG. This may be useful for styling or for implementing custom interactions.

```svelte
<Plot>
    <g>
        <Line data={aapl} x="Date" y="Close" />
    </g>
</Plot>
```
