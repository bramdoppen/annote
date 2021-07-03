<template>
	<div class="notelist">
		<ul class="list">
			<li class="list-item" v-for="note in noteList" :key="note.id">
				<button class="list-button" type="button" @click="selectNote(note.id)" :class="{'current': note.id == currentNoteId}">
					<h2>{{ note.data.title }}</h2>
					<span>{{ getDate(note.data.updated) }}</span>
				</button>
			</li>
		</ul>
		<Button @click="createNew()" class="button">New note</Button>
	</div>
</template>

<script>
	import Button from "@/components/Button";
	import { db } from "@/functions/fbconfig.js";
	import { ref, computed } from "vue";
	import { useStore } from "vuex";
	import { useRouter, useRoute } from "vue-router";

	export default {
		components: {
			Button,
		},
		setup() {
			const router = useRouter();
			const route = useRoute();
			const store = useStore();
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
						router.push(`/note/${docRef.id}`);
						console.log("Document written with ID: ", docRef.id);
					})
					.catch((error) => {
						console.error("Error adding document: ", error);
					});
			};

			const addToList = (doc) => {
				const existsAtIndex = noteList.value.findIndex((note) => note.id === doc.id);
				if (existsAtIndex >= 0) {
					noteList.value[existsAtIndex].data = doc.data();
				} else {
					noteList.value.push({ id: doc.id, data: doc.data() });
				}
			};

			const getNotes = () => {
				console.log(store.getters.userId);
				db.collection("notes")
					.where("uid", "==", store.getters.userId)
					.onSnapshot((querySnapshot) => {
						noteList.value = [];
						querySnapshot.forEach((doc) => {
							console.log(doc.data());
							addToList(doc);
						});
					});
			};

      const currentNoteId = computed(() => route.params.id)

			getNotes();

			return {
				noteList,
				getDate,
				selectNote,
				createNew,
        currentNoteId,
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
  .list {
    display: flex;
    flex-direction: column;
    padding: 0;
    list-style: none;
    flex: 1;
    margin: 0;
  }
	.list-button {
		border: 0;
		border-bottom: 1px solid #ddd;
		text-align: left;
		cursor: pointer;
    width: 100%;
	}
  .list-button.current {
		background: rgba(0, 0, 0, 0.05);
  }
	.list-button:hover {
		background: rgba(0, 0, 0, 0.1);
	}
  
  .button {
    margin: 20px;
  }

	h2 {
		font-size: 18px;
	}
</style>
