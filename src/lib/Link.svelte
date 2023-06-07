<script lang="ts">
  import { onDestroy } from 'svelte/internal';
  import { type Link as MLLink } from '../model/MyLinks-interface';
  import { applicationStore } from '../common/AppConfig';
  import LinkEditDialog from './LinkEditDialog.svelte';
  import LinkIcon from './LinkIcon.svelte';
  import { getModal } from './Modal.svelte';

  export let value: MLLink;
  let appShowShortcut = false;
  let isMouseOver = false;

  let component: unknown;
  let props;

  $: showShortcut = isShortcutVisible(appShowShortcut || isMouseOver);

  function isShortcutVisible(hideShortcuts: boolean): boolean {
    return value.shortcut ? hideShortcuts : false;
  }

  const unsubscribe = applicationStore.subscribe(store => {
    appShowShortcut = !store.config.hideShortcuts;
  });

  function onClickEditLink(): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    props = { link: value };
    component = LinkEditDialog;
    getModal().open();
  }

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
      <span class="edit-actions" on:click|stopPropagation|preventDefault={onClickEditLink}>Edit Link</span>
      {#if (showShortcut && value.shortcut)}
        <kbd>{value.shortcut}</kbd>
      {/if}
    </div>
  </div>
</a>

<svelte:component this={component} {...props}/>

<style>
  .edit-actions {
    /*display: none;*/
  /*}*/
  /**/
  /*.item-link:hover .edit-actions {*/
    color: #aaa;
    background-color: #fff;
    display: inline;
  }

  .item-link:hover .edit-actions:hover {
    color: blue;
    background-color: #fff;
  }

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

  .item-link:focus .label {
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
