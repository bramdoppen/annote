<template>
	<div class="notelist">
		<ul class="list">
			<li class="list-item" v-for="note in sortedNoteList" :key="note.id">
				<button class="list-button" type="button" @click="selectNote(note.id)" :class="{ current: note.id == currentNoteId }">
					<h2 class="title">{{ note.data.title }}</h2>
					<span class="date">{{ getDate(note.data.updated) }}</span>
				</button>
			</li>
		</ul>
		<div class="button-holder">
			<Button @click="createNew()" class="button">New note</Button>
		</div>
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

			const isToday = (someDate) => {
				const today = new Date();
				return someDate.getDate() == today.getDate() && someDate.getMonth() == today.getMonth() && someDate.getFullYear() == today.getFullYear();
			};

			const buildZero = (input) => {
				return `${input < 10 ? "0" : ""}${input}`;
			}

			const getDate = (time) => {
				if (time && time.seconds) {
					const date = new Date(time.seconds * 1000);

					const day = () => {
						if (isToday(date)) {
							return "Today"
						} else {
							return `${date.getDay()}-${date.getMonth()}-${date.getFullYear()} `;
						}
					};

					return `${day()}, ${buildZero(date.getHours())}:${buildZero(date.getMinutes())}`;
				}
			};

			const createNew = () => {
				return db
					.collection("notes")
					.add({
						title: "New note",
						uid: store.getters.userId,
						updated: new Date(),
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

			const currentNoteId = computed(() => route.params.id);

			const sortedNoteList = computed(() => {
				const compare = (a, b) => {
					return b.data.updated.seconds - a.data.updated.seconds;
				};
				return noteList.value.slice().sort(compare);
			});

			getNotes();

			return {
				getDate,
				selectNote,
				createNew,
				currentNoteId,
				sortedNoteList,
			};
		},
	};
</script>

<style scoped>
	.notelist {
		border-right: 1px solid #ddd;
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}
	.list {
		display: flex;
		flex-direction: column;
		padding: 0;
		list-style: none;
		flex: 1;
		margin: 0;
		overflow: auto;
	}
	.list-button {
		border: 0;
		text-align: left;
		cursor: pointer;
		width: 100%;
		display: flex;
		flex-direction: column;
		row-gap: 6px;
		padding: 16px 20px;
		background: #fffcfa;
	}
	.list-item::after {
		content: "";
		border-bottom: 1px solid #ddd;			

	}
	.list-button.current {
		background: rgba(0, 0, 0, 0.05);
	}
	.list-button:hover {
		background: var(--c-one);
		filter: brightness(1.1);
		
	}
	.button-holder {
		position: sticky;
		bottom: 0;
		border-top: 1px solid #ddd;
	}
	.button {
		margin: 20px;
		width: calc(100% - 40px);
	}

	.title {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin: 0;
	}
	h2 {
		font-size: 16px;
		line-height: 1.4;
	}
	.date {
		opacity: 0.5;
	}
</style>
