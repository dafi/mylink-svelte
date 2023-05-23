<script lang="ts">
  import { type Widget as MLWidget } from '../model/MyLinks-interface';
  import { openAllLinks } from '../model/MyLinks';
  import Link from './Link.svelte';

  interface WidgetExtraCssClass {
    window: string;
    listContainer: string;
    list: string;
    expandIcon: string;
  }

  interface MinimizeStatus {
    startMinimized: boolean;
    isMinimized: boolean;
  }

  function toggleMinimize(mini: boolean): void {
    if (startMinimized && isMinimized !== mini) {
      isMinimized = mini;
    }
  }

  function toggleWidgetSize(): void {
    startMinimized = !startMinimized;
    localStorage.setItem(`${value.id}-minimized`, startMinimized ? 't' : 'f');
    isMinimized = startMinimized;
  }

  function cssExtraClasses(status: MinimizeStatus): WidgetExtraCssClass {
    const cls: WidgetExtraCssClass = {
      window: '',
      list: '',
      listContainer: '',
      expandIcon: ''
    };

    if (status.startMinimized) {
      if (status.isMinimized) {
        cls.list = 'ml-widget-show-minimized-list-hidden';
      } else {
        cls.window = 'ml-widget-show-minimized-window';
        cls.listContainer = 'ml-widget-show-minimized-list-container';
        cls.list = 'ml-widget-show-minimized-list-visible';
        cls.expandIcon = 'fa fa-angle-down';
      }
    } else {
      cls.expandIcon = 'fa fa-angle-up';
    }
    return cls;
  }

  export let value: MLWidget;
  let startMinimized = value && localStorage.getItem(`${value.id}-minimized`) === 't';
  let isMinimized = startMinimized;

  $: cssClasses = cssExtraClasses({ startMinimized, isMinimized });

</script>

<div class={`ml-widget ${cssClasses.window}`} data-list-id={value.id}
     on:mouseover={() => toggleMinimize(false)}
     on:mouseout={() => toggleMinimize(true)}>
  <div class="ml-widget-label">
    <h2>{value.title}</h2>
    <span class="ml-toolbar">
      <i class={`${cssClasses.expandIcon} icon`} on:click={() => toggleWidgetSize()}></i>
      <i class="fa fa-external-link-alt icon" on:click={() => openAllLinks(value)}></i>
    </span>
  </div>
  <div class={cssClasses.listContainer}>
    <ul class={`ml-widget-list ${cssClasses.list}`}>
      {#each value.list as v (v.url)}
        <li>
          <Link value={v}/>
        </li>
      {/each}
    </ul>
  </div>
</div>
