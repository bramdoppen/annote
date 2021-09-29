<template>
	<div class="editor" v-if="!error">
    <header class="editor-header">
      <span v-if="isSaving" class="saving">Saving...</span>
      <span v-if="!isSaving" class="saving">Saved</span>
      <button @click="confirmDelete()">Delete</button>
    </header>
		<Editor class="editor-editor" v-model:modelValue="editorValue" />
	</div>
	<div class="editor" v-if="error">
		<span>This document does not exist: {{ error }}</span>
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
				error: null,
				loaded: false,
			};
		},
		methods: {
			confirmDelete() {
				if (window.confirm("Delete this note?")) {
					this.deleteNote();
				}
			},

			deleteNote() {
				const noteId = this.$route.params.id;
				db.collection("notes")
					.doc(noteId)
					.delete()
					.then(() => {
						this.$router.push("/");
					})
					.catch((error) => {
						this.error = error;
					});
			},

			getData() {
				clearTimeout(this.savingTimeout);
				const noteId = this.$route.params.id;
				const docRef = db.collection("notes").doc(noteId);
				this.error = null;
				this.loaded = false;

				docRef
					.get()
					.then((doc) => {
						if (doc.exists) {
							this.editorValue = doc.data().editor;
							console.log("Document data:", doc.data().editor);
						} else {
							console.log("No such document!");
						}
					})
					.catch((error) => {
						this.error = error;
					})
					.finally(() => {
						this.loaded = true;
					});
			},
			updateDoc(editorValue) {
				this.isSaving = true;

				const noteId = this.$route.params.id;
				const documentTitle = this.createHeading(editorValue);
				var docRef = db.collection("notes").doc(noteId);

				docRef
					.update({
						title: documentTitle,
						editor: editorValue,
						updated: new Date(),
					})
					.then(() => {
						this.isSaving = false;
					});
			},
			createHeading(text) {
				const createdDiv = document.createElement("div");
				createdDiv.innerHTML = text.substr(0, 100);
				return createdDiv.textContent || createdDiv.innerText || "";
			},
		},
		created() {
			this.getData();
		},

		beforeUnmount() {
			if (this.savingTimeout) {
				clearTimeout(this.savingTimeout);
			}
		},

		watch: {
			$route: "getData",
			editorValue(editorValue) {
				if (this.loaded) {
					clearTimeout(this.savingTimeout);
					this.savingTimeout = setTimeout(() => {
						this.updateDoc(editorValue);
					}, 1000);
				}
			},
		},
	};
</script>

<style scoped>
	.editor {
		text-align: left;
		padding: 40px;
		outline: 0;
    display: flex;
    flex-direction: column;
		min-height: 100%;
	}

  .editor-header {
    flex: 0 0 auto;
  }
  .editor-editor {
    flex: 1;
		display: flex;
		min-height: 100%;
  }

	.editor >>> .ProseMirror {
		outline: 0;
		width: 100%;
	}

	.saving {
		font-size: 10px;
		opacity: 0.5;
	}
</style>
