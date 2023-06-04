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

<a href={value.url} target="_blank" rel="noopener noreferrer" class="item-link"
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

<style>
  .item-link {
    color: var(--link-label-color);
    display: block;
    font-size: var(--link-label-font-size);
    text-decoration: none;
  }

  .item-link::after {
    content: '';
    display: block;
    width: 0;
    height: 2px;
    transition: width .3s;
    background: var(--link-underline-color);
  }

  .item-link:hover::after {
    width: 100%;
  }

  .item-link:focus {
    text-decoration: none;
    outline: 0;
    font-weight: bold;
  }

  .content {
    display: flex;
    justify-content: space-between;
  }

  .left-items {
    flex: 1;
    display: flex;
    align-items: center;
  }

  kbd {
    border-radius: 3px;
    background-color: var(--link-key-background, #eee);
    color: var(--link-key-color, #333);
    border: 1px solid var(--link-key-border-color);
    box-shadow: 0 1px 1px var(--box-shadow-color1), 0 2px 0 0 var(--box-shadow-color2) inset;
    font-size: 1.1em;
    font-weight: 700;
    line-height: 1;
    padding: 0 4px;
    white-space: nowrap;
  }

</style>
