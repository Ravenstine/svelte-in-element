<script>
  import InElement from '../../../index';

  let show = true;
  let value = 'Hello World';

  const target = document.getElementById('target');

  function toggle() {
    show = !show;
  }
</script>

<InElement {target}>
  {#if show}
    <h2>{value}</h2>
  {/if}
</InElement>

<button on:click={toggle}>{#if show}Hide{:else}Show{/if}</button>

<input bind:value={value}>
