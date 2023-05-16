<script lang="ts">
  import { onDestroy } from 'svelte/internal';
  import { type Link as MLLink } from '../model/MyLinks-interface';
  import { applicationStore } from '../common/AppConfig';
  import LinkIcon from './LinkIcon.svelte';

  export let value: MLLink;
  let appShowShortcut = false;
  let isMouseOver = false;

  $: showShortcut = isShortcutVisible(appShowShortcut || isMouseOver);

  function isShortcutVisible(hideShortcuts: boolean): boolean {
    return value.shortcut ? hideShortcuts : false;
  }

  const unsubscribe = applicationStore.subscribe(store => {
    appShowShortcut = !store.config.hideShortcuts;
  });

  onDestroy(unsubscribe);

</script>

<a href={value.url} target="_blank" rel="noopener noreferrer" class="ml-widget-item-link"
   on:mouseover={() => isMouseOver = true}
   on:mouseout={() => isMouseOver = false}>
    <div class="content">
        <div class="left-items">
            <LinkIcon link={value}/>
            <div class="label">{value.label}</div>
        </div>
        <div class="right-items">
            <kbd style:visibility={showShortcut ? 'visible' : 'collapse'}>{value.shortcut}</kbd>
        </div>
    </div>
</a>
