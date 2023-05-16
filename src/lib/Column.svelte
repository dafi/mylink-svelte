<script lang="ts">
  import Widget from './Widget.svelte';

  export let value: Widget[];

</script>

<section class="ml-rows">
    {#each value as widget (widget.id)}
        <Widget value={widget}/>
    {/each}
</section>
