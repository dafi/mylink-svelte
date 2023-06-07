<script lang="ts">
  import { type Link as MMLink } from '../model/MyLinks-interface';
  import Modal from './Modal.svelte';

  export let link: MMLink | undefined;
</script>

<Modal>
  <div>
    <h2 class="dialog-title">Edit Link</h2>

    <form>
      <ul class="flex-outer">
        <li>
          <label for="link-label">Label</label>
          <input type="text" value="{link.label}" id="link-label" placeholder="Videos">
        </li>
        <li>
          <label for="link-url">Url</label>
          <input type="text" value="{link.url}" id="link-url" placeholder="https://youtube.com">
        </li>
        <li>
          <label for="shortcut">Shortcut</label>
          <input type="text" id="shortcut" placeholder="F12">
        </li>
        <li>
          <button type="submit">Submit</button>
        </li>
      </ul>
    </form>


  </div>
</Modal>
