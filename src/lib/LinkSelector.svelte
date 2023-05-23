<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Fuse from 'fuse.js';
  import type { Link as MMLink, Widget } from '../model/MyLinks-interface';
  import LinkIcon from './LinkIcon.svelte';

  const dispatch = createEventDispatcher();

  interface Result {
    id: string;
    link: MMLink;
  }

  export let widgets: [Widget[]] | undefined = [];
  export let visible = false;
  let result: Result[] = [];
  let selectedIndex = -1;
  let listRefs: Record<string, HTMLElement>  = {};
  let inputBox: HTMLInputElement | undefined;

  const options = {
    keys: ['label']
  };

  $: links = widgets?.flat().map(w => w.list).flat() || [];
  $: fuse = new Fuse(links, options);
  $: moveFocusToSearch(visible);

  function onClick(e: MouseEvent, index: number): void {
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
      const liElement = listRefs[item.id];
      if (liElement) {
        liElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
      selectedIndex = newIndex;
    }
    e.preventDefault();
  }

  function onInput(e: Event): void {
    const pattern = (e.target as HTMLInputElement).value;

    listRefs = {};
    result = filter(pattern);
    selectedIndex = result.length ? 0 : -1;
  }

  function filter(pattern: string): Result[] {
    if (pattern.length === 0) {
      return [];
    }

    return fuse.search(pattern).map(r =>
      ({ id: r.item.id, link: r.item })
    );
  }

  function moveFocusToSearch(setFocus: boolean): void {
    if (setFocus) {
      inputBox?.focus();
    }
  }

  function onSelected(link: MMLink): void {
    dispatch('selected', link);
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
          <div>{r.link.label} {r.link.widget?.title ? ` - ${r.link.widget.title}` : ''}</div>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  :root {
    --link-selector-input-font-size: 2em;
    --link-selector-input-color: blue;
  }

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
    background-color: lightgray;
    color: black;
  }

  .link-selector .selected {
    background: blue;
    color: #fff;
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
    background: white;
    border-radius: 50%;
    display: inline-block;
    padding: 5px;
    width: 16px;
    height: 16px;
  }

</style>
