<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { type Widget as MLWidget } from '../model/MyLinks-interface';
  import { openAllLinks } from '../model/MyLinks.js';

  const dispatch = createEventDispatcher();

  export interface WidgetToolbarEvent {
    target: 'collapse';
    data?: unknown;
  }

  export let widget: MLWidget;
  export let collapsed = false;
  $: collapseIcon = collapsed ? 'fa fa-angle-down' : 'fa fa-angle-up';

  function onClickCollapse(_: Event): void {
    dispatch('action', {
      target: 'collapse',
    });
  }
</script>

<!-- eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -->
<span class="toolbar {$$restProps.class}">
  <i class={`${collapseIcon} icon`} on:click={(e) => onClickCollapse(e)}>
  </i><i class="fa fa-external-link-alt icon" on:click={() => openAllLinks(widget)}></i>
</span>

<style>
  .toolbar {
    float: right;
    line-height: 34px;
    cursor: pointer;
    display: none;
  }

  .toolbar .icon {
    padding-right: 8px;
    color: var(--widget-toolbar-icon-color);
  }

  .toolbar .icon:hover {
    animation-name: pulse;
    animation-duration: 0.7s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }

</style>
