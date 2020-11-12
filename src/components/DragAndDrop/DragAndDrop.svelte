<script lang="ts">
  export let loadFunction: (
    this: FileReader,
    ev: ProgressEvent<FileReader>
  ) => any;
  let dragAndDropWrapper: HTMLDivElement;

  function onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", loadFunction, false);
      reader.readAsDataURL(event.dataTransfer.files[0]);
    } else {
      console.warn("Bad file");
    }

    dragAndDropWrapper.style.opacity = "1";
  }

  function onDragOver(
    event: DragEvent & {
      currentTarget: EventTarget & HTMLDivElement;
    }
  ) {
    if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
  }

  function onDragEnter() {
    dragAndDropWrapper.style.opacity = "0.5";
  }

  function onDragLeave() {
    dragAndDropWrapper.style.opacity = "1";
  }

  const onDragEnd = onDragLeave;
</script>

<div
  style="width: 100%; height: 100%;"
  bind:this={dragAndDropWrapper}
  on:dragover|preventDefault={onDragOver}
  on:drop|preventDefault={onDrop}
  on:dragenter={onDragEnter}
  on:dragleave={onDragLeave}
  on:dragend={onDragEnd}>
  <slot />
</div>
