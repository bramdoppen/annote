<template>
  <div class="editor">
    <span v-if="isSaving" class="saving">Saving...</span>
    <span v-if="!isSaving" class="saving">Saved</span>
    <header>
      <input type="text" v-model="noteTitle">
    </header>
    <button @click="deleteNote()">Delete</button>
    <Editor v-model:modelValue="editorValue" />
    <span v-if="error">This document does not exist</span>
  </div>
</template>

<script>
import { db } from "@/functions/fbconfig.js";
import Editor from "@/components/Editor";

export default {
  components: {
    Editor,
  },
  data: () => {
    return {
      noteTitle: "",
      editorValue: "",
      isSaving: false,
      savingTimeout: null,
      error: null,
    };
  },
  methods: {
    deleteNote() {
      const noteId = this.$route.params.id;
      db.collection("notes").doc(noteId).delete().then(() => {
          console.log("Document successfully deleted!");
      }).catch((error) => {
          this.error = error
      });
    },
    getData() {
      const noteId = this.$route.params.id;
      const docRef = db.collection("notes").doc(noteId);
      this.error = null;
      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.noteTitle = doc.data().title;
            this.editorValue = doc.data().editor;
            console.log("Document data:", doc.data().editor);
          } else {  
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    },
    updateDoc(noteTitle, editorValue) {
      const noteId = this.$route.params.id;
      var docRef = db.collection("notes").doc(noteId);
      this.isSaving = true;

      // To update age and favorite color:
      docRef
        .update({
          title: noteTitle,
          editor: editorValue,
          updated: new Date()
        })
        .then(() => {
          this.isSaving = false;
          console.log("Document successfully updated!");
        });
    },
  },
  created() {
    this.getData();
  },
  watch: {
    "$route": "getData",
    noteTitle(value) {
      clearTimeout(this.savingTimeout);
      this.savingTimeout = setTimeout(() => {
        this.updateDoc(value, this.editorValue);
        console.log(value);
      }, 1000);
    },
    editorValue(value) {
      clearTimeout(this.savingTimeout);
      this.savingTimeout = setTimeout(() => {
        this.updateDoc(this.noteTitle, value);
        console.log(value);
      }, 1000);
    },
  },
};
</script>

<style scoped>
.editor {
  text-align: left;
  padding: 40px;
  outline: 0;
}
.editor >>> .ProseMirror {
  outline: 0;
}

.saving {
  font-size: 10px;
  opacity: 0.5;
}
</style>
