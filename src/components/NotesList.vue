<template>
	<div class="notelist">
		<button class="list-item" type="button" v-for="note in noteList" :key="note.id" @click="selectNote(note.id)">
			<h2>{{ note.data.title }}</h2>
			<span>{{ getDate(note.data.updated) }}</span>
		</button>
		<button class="create" type="button" @click="createNew()">New</button>
	</div>
</template>

<script>
	import { db } from "@/functions/fbconfig.js";
	import { ref } from "vue";
	import { useStore } from "vuex";
	import { useRouter } from "vue-router";

	export default {
		setup() {
			const router = useRouter();
      const store = useStore()
			const noteList = ref([]);

			const selectNote = (id) => {
				router.push({ path: `/note/${id}` });
			};

			const getDate = (time) => {
				if (time && time.seconds) {
					return new Date(time.seconds * 1000);
				}
			};

			const createNew = () => {
				return db
					.collection("notes")
					.add({
						title: "New note",
						uid: store.getters.userId,
						editor: "<p></p>",
					})
					.then((docRef) => {
						// this.addToList(docRef);
						this.$router.push(`/note/${docRef.id}`);
						console.log("Document written with ID: ", docRef.id);
					})
					.catch((error) => {
						console.error("Error adding document: ", error);
					});
			};

			const addToList = (doc) => {
        const existsAtIndex = noteList.value.findIndex((note) => note.id === doc.id);
        if(existsAtIndex >= 0 ) {
          noteList.value[existsAtIndex].data = doc.data();
        } else {
          noteList.value.push({ id: doc.id, data: doc.data() });
        }
			};

			const getNotes = () => {
				db.collection("notes")
					.where("uid", "==", store.getters.userId)
					.onSnapshot((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							console.log(doc.data());
							addToList(doc);
						});
					});
			};

			getNotes();

			return {
				noteList,
				getDate,
				selectNote,
				createNew,
			};
		},
	};
</script>

<style scoped>
	.notelist {
		background: #f5f5f5;
		border-right: 1px solid #ddd;
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: auto;
	}
	.list-item {
		border: 0;
		border-bottom: 1px solid #ddd;
		text-align: left;
		cursor: pointer;
	}

	.list-item:hover {
		background: rgba(0, 0, 0, 0.1);
	}

	h2 {
		font-size: 18px;
	}
</style>
