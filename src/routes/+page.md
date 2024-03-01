---
title: Reactive data visualization
description: The best visualizations are built with <span>Svelte.</span>
heroImage: /logo.png
tagline: Inspired by Observable Plot, written in Svelte 5, built on top of D3.js!
actions:
    - label: Getting started
      type: flat
      to: /getting-started
    - label: Why SveltePlot?
      to: /why-svelteplot
      type: primary
features:
    - title: Marks
      description: To help you can start writing with minimal configuration.
      icon:
          type: iconify
          collection: carbon
          name: roadmap
      link: /features/scales
    - title: Automatic scales
      description: Preserve the full power of Sveltekit. So that you can do more than SSG.
      icon:
          type: iconify
          collection: ri
          name: ruler-line
      link: /features/scales
    - title: Fully reactive
      description: Feel free to use svelte (3 and 4) in markdown. Explore infinite possibilities.
      icon:
          type: iconify
          collection: vscode-icons
          name: file-type-svelte
      link: /features/interactivity
    - title: TypeScript
      description: All components are fully typed and documented to integrate with VSCode
      icon:
          type: iconify
          collection: nonicons
          name: typescript-16
      link: /features/scales
    - title: Theme Customizable
      description: Feel free to use default theme, community themes or write your own.
      icon:
          type: iconify
          collection: emojione
          name: artist-palette
      link: /features/scales
    - title: Written in Svelte5 & TypeScript
      description: All components and props are fully reactive, typed and documented!
      icon:
          type: iconify
          collection: ri
          name: svelte-line
      link: /features/scales
---

<script>
  import { preloadData, preloadCode } from '$app/navigation';

  $effect(() => {
    preloadCode('/getting-started');
    preloadData('/introduction');
  });
  
</script>

<style>
  :global(.intro .description) {
    font-size: 2.8rem!important;
    font-weight: 600!important;
    line-height: 1.1!important;
  }
</style>
