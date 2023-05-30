<script lang="ts">
  import { onMount } from 'svelte';
  import { type AppConfig, applicationStore, } from './common/AppConfig';
  import { Config } from './common/Config';
  import { isShortcutsHidden, setHideShortcuts } from './common/config/shortcuts';
  import { UIInput } from './common/UIInput';
  import Grid from './lib/Grid.svelte';
  import LinkSelector from './lib/LinkSelector.svelte';
  // https://youtrack.jetbrains.com/issue/WEB-46268/Support-TypeScript-in-Svelte#focus=Comments-27-6627302.0-0
  // https://youtrack.jetbrains.com/issue/WEB-58188/Support-import-from-module-context
  import Modal, { getModal } from './lib/Modal.svelte';
  import type ToolbarEvent from './lib/Toolbar.svelte';
  import Toolbar from './lib/Toolbar.svelte';
  import { MyLinksHolder, openLink } from './model/MyLinks';
  import { type Link as MMLink, type MyLinks as MMLinks } from './model/MyLinks-interface';

  function onFileSelect(file: File): void {
    Config.fromFile(file, (myLinks?: MMLinks | null) => {
      reloadAll(myLinks);
    });
  }

  function reloadAll(myLinks?: MMLinks | null): void {
    if (!myLinks) {
      return;
    }
    myLinksHolder = new MyLinksHolder(myLinks);
    myLinksHolder.applyBackground();
    myLinksHolder.applyTheme();
    myLinksHolder.applyColorToFavicon(myLinks.theme?.faviconColor);

    UIInput.instance().setup(myLinksHolder);

    applicationStore.update(s => {
      s.config = buildConfig(myLinks);
      return s;
    });

    columns = myLinks.columns;
    hasShortcuts = myLinksHolder.hasShortcuts();
  }

  function buildConfig(myLinks: MMLinks): AppConfig {
    return {
      theme: {
        faviconColor: myLinks.theme?.faviconColor || '#ff0000',
      },
      faviconService: myLinks.config?.faviconService,
      hideShortcuts: isShortcutsHidden()
    };
  }

  function onShortcut(): void {
    const holder = myLinksHolder;
    if (holder) {
      setHideShortcuts(!isShortcutsHidden());
      applicationStore.update(s => {
        s.config = buildConfig(holder.myLinks);
        return s;
      });
    }
  }

  function handleToolbarEvent(event: CustomEvent<ToolbarEvent>): void {
    const toolbarEvent = event.detail;

    if (toolbarEvent.target === 'file') {
      onFileSelect(toolbarEvent.data as File);
    } else if (toolbarEvent.target === 'shortcut') {
      onShortcut();
    }
  }

  function keyDown(e: KeyboardEvent): boolean {
    if (isOpen) {
      return e.key === 'Escape';
    }
    if (e.key === ' ') {
      e.stopPropagation();
      e.preventDefault();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      getModal().open();
      return true;
    }
    return UIInput.instance().keyDown(e);
  }

  function onLinkSelected(event: CustomEvent<MMLink>): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    getModal().close();
    // Ensure the DOM is updated and the dialog is hidden when the link is open
    // This is necessary because when returning to myLinks window/tab, the dialog can be yet visible
    window.requestIdleCallback(() => openLink(event.detail));
  }

  onMount(() => {
    document.addEventListener('keydown', (e) => keyDown(e), false);
    Config.fromData((myLinks?: MMLinks | null) => {
      reloadAll(myLinks);
    });
  });

  let myLinksHolder: MyLinksHolder | undefined;
  let columns = [[]];
  let hasShortcuts = false;
  let isOpen = false;
</script>

<main>
  <div class="wrapper">
    <div class="grid-container">
      <Grid columns={columns}/>
    </div>

    <Toolbar
      hasShortcuts={hasShortcuts}
      on:action={handleToolbarEvent}></Toolbar>

    <Modal bind:visible={isOpen}>
      <LinkSelector visible={isOpen}
                    widgets={columns}
                    on:selected={onLinkSelected}/>
    </Modal>
  </div>
</main>

<style>
  .wrapper {
    padding: 5px;
    margin: 5px;
  }
</style>
