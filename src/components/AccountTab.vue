<template>
	<div class="tab">
		<Button @click="navOpen = !navOpen" class="tab-button" :classList="['small']">{{ displayName }}</Button>
		<transition name="fade">
			<ul v-show="navOpen" class="list">
				<li class="list-item">
					<Button type="button" @click="logout()" class="list-button" :classList="['small']">Logout</Button>
				</li>
			</ul>
		</transition>
	</div>
</template>

<script>
	import Button from "@/components/Button";
	import { ref } from "vue";
	import { useStore } from "vuex";
	import { useRouter } from "vue-router";
	import { fb } from "@/functions/fbconfig.js";

	export default {
		components: {
			Button,
		},
		setup() {
			const store = useStore();
			const router = useRouter();
			const navOpen = ref(false);
			const displayName = store.state.user.displayName;
			const logout = () => {
				fb.auth()
					.signOut()
					.then(() => {
						store.dispatch("signOut");
						router.push({ path: "/login" });
					});
			};
			return {
				navOpen,
				displayName,
				logout,
			};
		},
	};
</script>

<style scoped>
	.tab {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 10px;
	}

	.list {
		display: flex;
		flex-direction: column;
		padding: 0;
		margin: 0;
		list-style: none;
		min-width: 120px;
	}

	.list-item {
		margin: 0;
		height: 50px;
	}

	.list-item:first-child:not(:last-child) > .list-button {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}
	.list-item:not(:first-child) > .list-button {
		border-top: 0;
	}
	.list-item:last-child:not(:first-child) > .list-button {
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
	.list-item:not(:first-child):not(:last-child) > .list-button {
		border-radius: 0;
	}

	.list-button {
		height: 100%;
		width: 100%;
		padding-top: 0;
		padding-bottom: 0;
	}
</style>
