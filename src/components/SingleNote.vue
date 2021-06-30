<template>
  <div class="editor">
    <span v-if="isSaving" class="saving">Saving...</span>
    <span v-if="!isSaving" class="saving">Saved</span>
    <Editor v-model:modelValue="editorValue" />
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
      editorValue: "",
      isSaving: false,
      savingTimeout: null,
    };
  },
  methods: {
    getData() {
      const noteId = this.$route.params.id;
      const docRef = db.collection("notes").doc(noteId);

      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
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
    updateDoc(updatedValue) {
      const noteId = this.$route.params.id;
      var docRef = db.collection("notes").doc(noteId);
      this.isSaving = true;

      // To update age and favorite color:
      docRef
        .update({
          editor: updatedValue,
          updated: new Date()
        })
        .then(() => {
          this.isSaving = false;
          console.log("Document successfully updated!");
        });
    },
  },
  mounted() {
    this.getData();
  },
  watch: {
    editorValue(value) {
      clearTimeout(this.savingTimeout);
      this.savingTimeout = setTimeout(() => {
        this.updateDoc(value);
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
