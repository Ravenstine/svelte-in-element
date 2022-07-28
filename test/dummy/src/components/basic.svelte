<script>
  import InElement from '../../../../index';

  let show = true;
  let value = 'Hello World';
  let targetName = 'a';

  let target = document.getElementById(`target-${targetName}`);
  let anchor;

  function toggle() {
    show = !show;
  }

  function switchTarget() {
    targetName = targetName === 'a' ? 'b' : 'a';
    target = document.getElementById(`target-${targetName}`);
    anchor = document.getElementById(`target-${targetName}-anchor`);
  }
</script>

<InElement {target} insertBefore={anchor}>
  {#if show}
    <h2>{value}</h2>
  {/if}
</InElement>

<button id="show-hide" on:click={toggle}>{#if show}Hide{:else}Show{/if}</button>
<button id="switch-target" on:click={switchTarget}>Switch Target</button>

<input bind:value={value}>
