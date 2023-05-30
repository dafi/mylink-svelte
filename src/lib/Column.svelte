<script lang="ts">
  import Widget from './Widget.svelte';

  export let value: Widget[];

</script>

<section>
    {#each value as widget (widget.id)}
        <Widget value={widget}/>
    {/each}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: flex-start;
    margin: 5px 0;
    width: 100%;
  }
</style>
