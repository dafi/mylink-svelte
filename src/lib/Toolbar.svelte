<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let hasShortcuts = false;

  export interface ToolbarEvent {
    target: 'file' | 'shortcut';
    data?: unknown;
  }

  function handleFileSelect(evt: Event): void {
    // svelte doesn't have the rich react event typescript types like ChangeEvent<HTMLInputElement>
    // so we use Type Assertions
    const target = evt.target as HTMLInputElement;
    if (!evt.target) {
      return;
    }
    const file = target.files && target.files[0];
    // onChange is not called when the path is the same so, we force the change
    target.value = '';
    if (file) {
      dispatch('action', {
        target: 'file',
        data: file
      });
    }
  }

  function onClickKeyboard(_e: Event): void {
    dispatch('action', {
      target: 'shortcut',
    });
  }
</script>

<div class="toolbar-container">
  <label class="toolbar-icon" title="Load configuration from local file">
    <i class="fa fa-file-import"></i>
    <input type="file" id="files" name="files[]"
           accept="application/json"
           on:change={e => handleFileSelect(e)}/>
  </label>

  <label class="toolbar-icon"
         title="Toggle shortcuts visibility"
         style:visibility={ hasShortcuts ? 'visible' : 'collapse'}
         on:click={e => onClickKeyboard(e)}>
    <i class="fa fa-keyboard"></i>
  </label>
</div>

<style>

  .toolbar-container {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    flex-direction: row;
  }

  /** from https://gist.github.com/barneycarroll/5244258 **/
  .toolbar-icon {
    overflow: hidden;
    position: relative;
  }

  .toolbar-icon [type=file] {
    cursor: inherit;
    display: block;
    font-size: 999px;
    min-height: 100%;
    min-width: 100%;
    opacity: 0;
    position: absolute;
    right: 0;
    text-align: right;
    top: 0;
  }

  .toolbar-icon {
    background: #ddd;
    color: #333;
    border-radius: .5em;
    padding: 5px;
    margin: 5px;
    font-size: 1.2em;
    opacity: 0.3;
  }

  .toolbar-icon:hover {
    opacity: 1.0;
  }

  .toolbar-icon [type=file] {
    cursor: pointer;
  }
</style>
