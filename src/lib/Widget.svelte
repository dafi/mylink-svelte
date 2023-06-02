<script lang="ts">
  import { type Widget as MLWidget } from '../model/MyLinks-interface';
  import Link from './Link.svelte';
  import type WidgetToolbarEvent from './WidgetToolbar.svelte';
  import WidgetToolbar from './WidgetToolbar.svelte';

  function toggleCollapse(newState: boolean): void {
    if (startCollapsed && collapsed !== newState) {
      collapsed = newState;
    }
  }

  function toggleWidgetSize(): void {
    startCollapsed = !startCollapsed;
    localStorage.setItem(`${value.id}-collapsed`, startCollapsed ? 't' : 'f');
    collapsed = startCollapsed;
  }

  function handleToolbarEvent(event: CustomEvent<WidgetToolbarEvent>): void {
    const toolbarEvent = event.detail;

    if (toolbarEvent.target === 'collapse') {
      toggleWidgetSize();
    }
  }

  export let value: MLWidget;
  let startCollapsed = value && localStorage.getItem(`${value.id}-collapsed`) === 't';
  let collapsed = startCollapsed;

  $: collapsedVisible = startCollapsed && !collapsed;

</script>

<div class="widget"
     class:collapsed={startCollapsed}
     class:collapsed-visible={collapsedVisible}
     data-list-id={value.id}
     on:mouseover={() => toggleCollapse(false)}
     on:mouseout={() => toggleCollapse(true)}>
  <div>
    <h2 class="title">{value.title}</h2>
    <WidgetToolbar
      on:action={handleToolbarEvent}
      class="hover-toolbar"
      widget={value}
      bind:collapsed={startCollapsed}></WidgetToolbar>
  </div>
  <div class="list-container">
    <ul class="list">
      {#each value.list as v (v.url)}
        <li>
          <Link value={v}/>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .widget {
    flex: 1;
    border: 1px solid var(--widget-border-color);
    margin: 5px 10px;
    background-color: var(--widget-background-color, #ff0000);
    box-shadow: 8px 8px 6px rgba(0,0,0,.2);
    border-radius: var(--widget-border-radius);
  }

  /* apply style to child element **/
  .widget:hover :global(.hover-toolbar) {
    display: block;
  }

  ul {
    list-style-type: none;
    min-height: 23px;
    overflow-x: hidden;
    margin: 0;
  }

  li {
    margin-bottom: 2px;
  }

  .title {
    color: #000;
    display: inline;
    flex-grow: 1;
    font-size: var(--title-font-size);
    line-height: 34px;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 10px 10px 10px;
  }

  .list {
    padding: 0 10px 10px 10px;
    display: block;
  }

  .collapsed .list {
    display: none;
  }

  .collapsed.collapsed-visible .list {
    display: block;
  }

  .collapsed-visible {
    position: relative;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .collapsed-visible .list-container {
    position: absolute;
    width: 100%;
    background-color: var(--widget-background-color);
    border-left: 1px solid var(--widget-border-color);
    border-right: 1px solid var(--widget-border-color);
    border-bottom: 1px solid var(--widget-border-color);
    left: -1px;
    box-shadow: 8px 8px 6px rgba(0, 0, 0, .2);
    border-bottom-left-radius: var(--widget-border-radius);
    border-bottom-right-radius: var(--widget-border-radius);
  }
</style>
