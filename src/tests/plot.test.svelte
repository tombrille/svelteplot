<script lang="ts">
    import { Plot } from '$lib/index.js';
    import type { ComponentProps } from 'svelte';

    let args: ComponentProps<typeof Plot> = $props();
</script>

<Plot {...args} />
