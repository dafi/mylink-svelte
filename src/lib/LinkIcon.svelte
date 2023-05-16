<script lang="ts">
  import { applicationStore } from '../common/AppConfig';
  import { type Link as MLLink } from '../model/MyLinks-interface';
  import { faviconUrlByLink } from '../model/MyLinks';

  const colors = [
    '#FF5666', '#A9714B', '#531CB3', '#28C2FF', '#3066BE', '#963484',
    '#729B79', '#44CF6C', '#3498DB', '#AAAAAA', '#0074D9', '#3D9970',
    '#2ECC40', '#B10DC9', '#0000FF', '#00FFFF', '#008080', '#00FF00',
    '#FF851B', '#FFA500', '#FF0000', '#F012BE', '#FF00FF',
  ];


  function hash(str: string): number {
    // the worst way to compute a hash value, but we only need that it is deterministic
    return Array
      .from(str)
      .reduce((p, c) => p + c.charCodeAt(0), str.length);
  }

  export let link: MLLink | undefined;
  const faviconUrl = link ? faviconUrlByLink(link, $applicationStore.config.faviconService) : undefined;
</script>

{#if faviconUrl}
    <img src={faviconUrl} class="link-icon-favicon" alt=""/>
{:else}
    <div style:color="#fff"
         style:background-color={colors[hash(link.label) % colors.length]}
         class="link-icon-favicon-missing">{link.label.charAt(0)}
    </div>
{/if}

<style>
    .link-icon-favicon {
        width: 16px;
        height: 16px;
        line-height: 16px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 16px 16px;
        margin-right: 6px;
    }

    .link-icon-favicon img {
        max-width: 16px;
        max-height: 16px;
        min-width: 16px;
        min-height: 16px;
    }

    .link-icon-favicon-missing {
        width: 16px;
        height: 16px;
        max-width: 16px;
        max-height: 16px;
        min-width: 16px;
        min-height: 16px;
        border-radius: 50%;

        margin-right: 6px;

        display: grid;
        align-items: center;
        justify-content: center;
        text-transform: capitalize;
        text-indent: 0;
        font-style: normal;
        font-size: 0.9em;
        font-weight: bold;
        line-height: 0;
    }

</style>
