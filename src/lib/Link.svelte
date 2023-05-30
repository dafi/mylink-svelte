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
    color: #444;
    display: block;
    font-size: var(--label-font-size);
    text-decoration: none;
  }

  .item-link::after {
    content: '';
    display: block;
    width: 0;
    height: 2px;
    transition: width .3s;
    background: #999;
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
    color: #444;
    display: flex;
    justify-content: space-between;
    text-decoration: none;
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
    border: 1px solid #b4b4b4;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset;
    font-size: 1.1em;
    font-weight: 700;
    line-height: 1;
    padding: 0 4px;
    white-space: nowrap;
  }

</style>
