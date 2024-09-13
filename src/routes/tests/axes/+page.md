---
title: Tests
---

Linear:

```svelte live
<script lang="ts">
    import { Plot } from '$lib/index.js';
</script>

<Plot grid x={{ axis: 'top', domain: [0, 100] }} />
```

Linear interval

```svelte live
<script lang="ts">
    import { Plot } from '$lib/index.js';
</script>

<Plot
    grid
    x={{ axis: 'top', domain: [0, 100], interval: 25 }} />
```

Linear auto-format

```svelte live
<script lang="ts">
    import { Plot } from '$lib/index.js';
</script>

<Plot grid x={{ axis: 'bottom', domain: [0, 1e6] }} />
```

Log auto-format

```svelte live
<script lang="ts">
    import { Plot } from '$lib/index.js';
</script>

<Plot
    grid
    x={{
        axis: 'both',
        type: 'log',
        domain: [200000, 3000000]
    }} />
```

Time auto-format

```svelte live
<script lang="ts">
    import { Plot } from '$lib/index.js';
</script>

<Plot
    debug
    grid
    x={{
        nice: true,
        domain: [new Date(2000, 0, 1), new Date(2002, 0, 1)]
    }} />
```

months

```svelte live
<script lang="ts">
    import { Plot } from '$lib/index.js';
</script>

<Plot
    debug
    grid
    x={{
        domain: [
            new Date(2000, 0, 1),
            new Date(2000, 11, 1)
        ]
    }} />
```

enforce quarterly ticks

```svelte live
<script lang="ts">
    import { Plot } from '$lib/index.js';
</script>

<Plot
    debug
    grid
    x={{
        interval: 'quarter',
        domain: [
            new Date(2000, 0, 1),
            new Date(2000, 11, 1)
        ]
    }} />
```

weeks

```svelte live
<script lang="ts">
    import { Plot } from '$lib/index.js';
</script>

<Plot
    debug
    grid
    x={{
        domain: [new Date(2000, 0, 1), new Date(2000, 2, 1)]
    }} />
```

daily

```svelte live
<script lang="ts">
    import { Plot } from '$lib/index.js';
</script>

<Plot
    debug
    grid
    x={{
        domain: [
            new Date(2000, 0, 1),
            new Date(2000, 0, 10)
        ]
    }} />
```
