<script lang="ts">
  import type { Widget } from '../model/MyLinks-interface';
  import Column from './Column.svelte';

  export let columns: [Widget[]];

</script>

<section class="columns">
    {#each columns as widget, index (index)}
        <Column value={widget}/>
    {/each}
</section>

<style>
  .columns {
    display: flex;
    flex-direction: row;
  }
</style>
