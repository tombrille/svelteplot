<script lang="ts">
    import { Arrow, Plot } from '$lib/index.js';
    import type { ComponentProps } from 'svelte';

    let args: ComponentProps<typeof Arrow> = $props();
</script>

<Plot width={100} height={100} axes={false}>
    <Arrow {...args} />
</Plot>
