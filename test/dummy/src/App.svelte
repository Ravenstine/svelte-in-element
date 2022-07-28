<script>
  import Basic from './components/basic.svelte';
  import QuerySelector from './components/query-selector.svelte';
  import NoTarget from './components/no-target.svelte';

  const pathname = window.location.pathname;
</script>

{#if pathname === '/'}
  <Basic />
{:else if pathname === '/query-selector'}
  <QuerySelector />
{:else if pathname === '/no-target'}
  <NoTarget />
{/if}
