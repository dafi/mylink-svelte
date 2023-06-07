<script context="module" lang="ts">
  export type CallbackType = (arg?: unknown) => void;

  export interface ModalWindow {
    open(callback?: CallbackType | undefined): void;
    close(retVal?: unknown): void;
  }

  let onTop: HTMLElement | null | undefined;   // keeping track of which open modal is on top
  const modals = new Map<string, ModalWindow>();  // all modals get registered here for easy future access

  // 	returns an object for the modal specified by `id`, which contains the API functions (`open` and `close` )
  export function getModal(mid = ''): ModalWindow {
    return modals.get(mid);
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte';

  export let visible = false;
  export let id = '';

  let topDiv: HTMLElement | null | undefined;
  let prevOnTop: HTMLElement | null | undefined;
  let closeCallback: CallbackType | undefined;

  function keyPress(ev: KeyboardEvent): void {
    // only respond if the current modal is the top one
    if (ev.key === 'Escape' && onTop === topDiv) {
      close();
    }
  }

  // API
  function open(callback?: CallbackType | undefined): void {
    closeCallback = callback;
    if (visible) {
      return;
    }
    prevOnTop = onTop;
    onTop = topDiv;
    window.addEventListener('keydown', keyPress);

    // this prevents scrolling of the main window on larger screens
    document.body.style.overflow = 'hidden';

    visible = true;
    // Move the modal in the DOM to be the last child of <BODY> so that it can be on top of everything
    document.body.appendChild(topDiv);
  }

  function close(retVal?: unknown): void {
    if (!visible) {
      return;
    }
    window.removeEventListener('keydown', keyPress);
    onTop = prevOnTop;
    if (onTop == null) {
      document.body.style.overflow = '';
    }
    visible = false;
    if (typeof closeCallback === 'function') {
      closeCallback(retVal);
    }
  }

  // expose the API
  modals.set(id, { open, close });

  onDestroy(() => {
    delete modals[id];
    window.removeEventListener('keydown', keyPress);
  });

</script>

<div class="backdrop" id="topModal" class:visible bind:this={topDiv} on:click={()=>close()}>
  <div class="modal" id='modal' on:click|stopPropagation={()=>{}}>
      <slot visible={visible}></slot>
  </div>
</div>

<style>
  .backdrop {
    visibility: hidden;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--dialog-backdrop-color);
    padding: 50px;
  }

  .modal {
    background-color: var(--dialog-background-color);
    border-radius: 5px;
    margin: 0 auto;
    padding: 5px;
    max-width: 750px;
    min-height: 40px;
    border: 1px solid var(--dialog-border-color);
  }

  .visible {
    visibility: visible !important;
  }

</style>
