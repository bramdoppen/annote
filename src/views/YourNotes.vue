<template>
  <div class="grid">
    <NotesList class="list" />
    <SingleNote class="note" />
    <AccountTab class="accounttab" />
  </div>
</template>

<script>
import NotesList from "@/components/NotesList";
import SingleNote from "@/components/SingleNote";
import AccountTab from "@/components/AccountTab";

export default {  
  components: {
    NotesList,
    SingleNote,
    AccountTab,
  }
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: max(150px, min(40vw, 250px)) 1fr;
  grid-template-areas: "sidebar note";
  height: 100vh;
}

.list {
  grid-area: sidebar;
}

.note {
  grid-area: note;
}

.accounttab {
  position: fixed;
  top: 40px;
  right: 40px;
}
</style>
