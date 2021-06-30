<template>
  <div class="grid">
    <NotesList class="list" />
    <SingleNote class="note" />
  </div>
</template>

<script>
import NotesList from "@/components/NotesList";
import SingleNote from "@/components/SingleNote";

export default {  
  components: {
    NotesList,
    SingleNote,
  }
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-areas: "sidebar note";
  height: 100vh;
}

.list {
  grid-area: sidebar;
}

.note {
  grid-area: note;
}
</style>
