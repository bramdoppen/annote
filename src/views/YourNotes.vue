<template>
  <div class="grid">
    <NotesList class="list" />
    <div class="note">
      <span v-if="!activeNote" class="note-empty">There is no note selected. Create a new note or select one.</span>
      <SingleNote v-if="activeNote"/>

    </div>
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
  },
  computed: {
    activeNote() {
      console.log(this.$route.params.id)
      return this.$route.params.id
    }
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
  height: 100%;
  overflow: auto;
}

.note-empty {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  opacity: 0.5;
  background: whitesmoke;
}

.accounttab {
  position: fixed;
  top: 40px;
  right: 40px;
}
</style>
