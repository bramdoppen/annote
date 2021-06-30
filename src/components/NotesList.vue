<template>
  <div class="notelist">
    <button
      class="list-item"
      type="button"
      v-for="note in notelist"
      :key="note.id"
      @click="selectNote(note.id)"
    >
      <h2>{{ note.data.title }}</h2>
      <span>{{ note.data.updated }}</span>
    </button>
    <button class="create" type="button" @click="createNew()">New</button>
  </div>
</template>

<script>
import { db } from "@/functions/fbconfig.js";

export default {
  data: () => {
    return {
      notelist: [],
    }
  },
  methods: {
    addToList(doc) {
      this.notelist.push({id: doc.id, data: doc.data()})
    },
    getNotes() {
      db.collection("notes")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.addToList(doc);
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
          });
        });
    },
    createNew() {
      db.collection("notes")
        .add({
          title: "New note",
          editor: "<p></p>",
        })
        .then((docRef) => {
          // this.addToList(docRef);
          this.$router.push(`/note/${docRef.id}`)
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    },
    selectNote(id) {
      this.$router.push({ path: `/note/${id}` });
    },
  },
  created() {
    this.getNotes();
  },
};
</script>

<style scoped>
.notelist {
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}
.list-item {
  border: 0;
  border-bottom: 1px solid #ddd;
  text-align: left;
  cursor: pointer;
}

.list-item:hover {
  background: rgba(0,0,0,0.1);
}

h2 {
  font-size: 18px;
}
</style>
