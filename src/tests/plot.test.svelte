<script lang="ts">
    import { Plot } from 'svelteplot';
    import type { ComponentProps } from 'svelte';

    let args: ComponentProps<typeof Plot> = $props();
</script>

<Plot {...args} />
