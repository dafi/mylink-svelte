<script lang="ts">
  import { onMount } from 'svelte';
  import Grid from './lib/Grid.svelte';
  import Spotlight from './lib/Spotlight.svelte';
  import Toolbar from './lib/Toolbar.svelte';
  import type ToolbarEvent from './lib/Toolbar.svelte';
  import { Config } from './common/Config';
  import { type MyLinks as MMLinks } from './model/MyLinks-interface';
  import { MyLinksHolder } from './model/MyLinks';
  import { UIInput } from './common/UIInput';
  import {
    type AppConfig,
    applicationStore,
  } from './common/AppConfig';
  import { isShortcutsHidden, setHideShortcuts } from './common/config/shortcuts';

  let myLinksHolder: MyLinksHolder | undefined;

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

  function handleToolbarEvent(event: CustomEvent): void {
    const toolbarEvent = event.detail as ToolbarEvent;
    if (toolbarEvent.target === 'file') {
      onFileSelect(toolbarEvent.data as File);
    } else if (toolbarEvent.target === 'shortcut') {
      onShortcut();
    }
  }

  function keyDown(e: KeyboardEvent): boolean {
    if (isOpen) {
      if (e.key === 'Escape') {
        return true;
      }
      return false;
    }
    if (e.key === ' ') {
      e.stopPropagation();
      e.preventDefault();

      return true;
    }
    return UIInput.instance().keyDown(e);
  }

  onMount(() => {
    document.addEventListener('keydown', (e) => keyDown(e), false);
    Config.fromData((myLinks?: MMLinks | null) => {
      reloadAll(myLinks);
    });
  });

  let columns = [[]];
  let hasShortcuts = false;
  let isOpen = false;
</script>

<main>
  <div class="ml-wrapper">
    <div class="ml-grid">
      <Grid columns={columns}/>
    </div>

    <Toolbar
            hasShortcuts={hasShortcuts}
            on:action={handleToolbarEvent}></Toolbar>

    <!--    <Spotlight show={this.state.isOpen}-->
    <!--               onClose={this.toggleModal}>-->
    <!--      <LinkSelector-->
    <!--              onSelected={this.onLinkSelected}-->
    <!--              widgets={this.myLinksHolder?.myLinks.columns}/>-->
    <!--    </Spotlight>-->

  </div>


</main>
