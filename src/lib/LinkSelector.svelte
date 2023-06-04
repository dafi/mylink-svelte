<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { LinkSearch } from '../common/LinkSearch';
  import type { LinkSearchResult } from '../common/LinkSearch.js';
  import type { Link as MMLink, Widget } from '../model/MyLinks-interface';
  import LinkIcon from './LinkIcon.svelte';

  const dispatch = createEventDispatcher();

  export let widgets: [Widget[]] | undefined = [];
  export let visible = false;
  let result: LinkSearchResult[] = [];
  const linkSearch = new LinkSearch();
  let selectedIndex = -1;
  let listRefs: Record<string, HTMLLIElement> = {};
  let inputBox: HTMLInputElement | undefined;

  $: linkSearch.setLinks(widgets?.flat().map(w => w.list).flat() || []);
  $: moveFocusToSearch(visible);
  $: clear(visible);

  function onClick(e: MouseEvent, index: number): void {
    // skip if a dblclick is in progress
    // https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
    if (e.detail !== 1) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    moveFocusToSearch(true);

    selectedIndex = index;
  }

  function onDoubleClick(e: MouseEvent, index: number): void {
    e.preventDefault();
    e.stopPropagation();

    moveFocusToSearch(true);
    onSelected(result[index].link);
  }

  function onKeyDown(e: KeyboardEvent): void {
    const currIndex = selectedIndex;
    let newIndex = -1;

    if (e.key === 'ArrowUp') {
      if (currIndex > 0) {
        newIndex = currIndex - 1;
      }
    } else if (e.key === 'ArrowDown') {
      if (currIndex < (result.length - 1)) {
        newIndex = currIndex + 1;
      }
    } else if (e.key === 'Enter') {
      if (currIndex >= 0) {
        onSelected(result[currIndex].link);
      }
    } else {
      return;
    }
    if (newIndex !== -1) {
      const item = result[newIndex];
      listRefs[item.id]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      selectedIndex = newIndex;
    }
    e.preventDefault();
  }

  function onInput(e: Event): void {
    const pattern = (e.target as HTMLInputElement).value;

    listRefs = {};
    result = linkSearch.filter(pattern);
    selectedIndex = result.length ? 0 : -1;
  }

  function moveFocusToSearch(setFocus: boolean): void {
    if (setFocus) {
      inputBox?.focus();
    }
  }

  function onSelected(link: MMLink): void {
    dispatch('selected', link);
  }

  function clear(_: boolean): void {
    if (inputBox) {
      inputBox.value = '';
    }
    result = [];
    selectedIndex = -1;
    listRefs = {};
  }
</script>

<div class="link-selector">
  <div class="input-container">
    <i class="fas fa-search icon"></i>
    <input type="text"
           bind:this={inputBox}
           on:keydown={(e) => onKeyDown(e)}
           on:input={(e) => onInput(e)}
           placeholder="Search"
           spellCheck="false"
           class="input-box"/>
  </div>
  <div class="list">
    <ul>
      {#each result as r, i (r.id)}
        <li class:selected={i === selectedIndex}
            on:click={e => onClick(e, i)}
            on:dblclick={e => onDoubleClick(e, i)}
            bind:this={listRefs[r.id]}
        ><i class="list-image">
          <LinkIcon link={r.link}/>
        </i>
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          <div>{@html r.highlighted} {r.link.widget?.title ? ` - ${r.link.widget.title}` : ''}</div>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .link-selector {
    padding: 10px 0 10px 0;
  }

  .link-selector .input-box {
    width: 100%;
    border: 0;
    font-size: var(--link-selector-input-font-size);
    color: var(--link-selector-input-color);
  }

  .link-selector .input-box:focus {
    outline: none;
  }

  .link-selector ul {
    list-style: none;
    max-height: 300px;
    margin: 0;
    overflow: auto;
    padding: 0;
    text-indent: 10px;
  }

  .link-selector li {
    line-height: 25px;
    user-select: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 4px;
  }

  .link-selector li:hover {
    background-color: var(--link-selector-hover-item-background-color);
    color: var(--link-selector-hover-item-text-color);
  }

  .link-selector .selected {
    background: var(--link-selector-selected-item-background-color);
    color: var(--link-selector-selected-item-text-color);
  }

  .link-selector .input-container {
    display: flex;
    width: 100%;
  }

  /* Style the form icons */
  .link-selector .icon {
    min-width: 50px;
    text-align: center;
    font-size: var(--link-selector-input-font-size);
    color: var(--link-selector-input-color);
  }

  .link-selector .list-image {
    background: var(--link-selector-image-background-color);
    border-radius: 50%;
    display: inline-block;
    padding: 5px;
    width: 16px;
    height: 16px;
  }

</style>
