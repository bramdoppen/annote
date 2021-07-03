<template>
	<div class="page">
		<div class="login-box">
			<header>
				<h1>Annoté</h1>
				<span v-if="!registrationActive">Login with your credentials</span>
				<span v-if="registrationActive">Register your new account</span>
			</header>
			<form class="form" @submit="login">
				<div class="f-row" v-if="registrationActive">
					<label for="input-zero" class="f-label">Display name:</label>
					<input id="input-zero" class="f-input" v-model="user.displayName" type="text" required placeholder="Display name" />
				</div>
				<div class="f-row">
					<label for="input-one" class="f-label">Username:</label>
					<input id="input-one" class="f-input" v-model="user.email" type="email" required placeholder="Email" />
				</div>
				<div class="f-row">
					<label for="input-two" class="f-label">Password:</label>
					<input id="input-two" class="f-input" v-model="user.password" type="password" required placeholder="Password" />
				</div>
				<div class="f-row" v-if="error">
					<span class="errors">{{ error.message }}</span>
				</div>
				<Button @click="registrationActive = !registrationActive" class="nobutton">
					<span v-if="!registrationActive">Register</span>
					<span v-if="registrationActive">Back to login</span>
				</Button>
				<Button type="submit" @click="registrationActive ? createUser(user, $event) : login(user, $event)">
					<span v-if="!registrationActive">Login</span>
					<span v-if="registrationActive">Register</span>
				</Button>
			</form>
		</div>
	</div>
</template>

<script>
	import Button from "@/components/Button";
	import { fb, db } from "@/functions/fbconfig.js";

	export default {
		components: {
			Button,
		},
		data: function() {
			return {
				user: {
					displayName: null,
					email: null,
					password: null,
				},
				registrationActive: false,
				error: null,

				userEmailForgot: null,
				isLoading: false,
				isForgot: false,
				forgotMessage: null,
				logErr: null,
				routerRedirect: null,
			};
		},
		methods: {
			handleLogin(user) {
				if (user) {
					const userProfile = {
						email: user.email,
						lastLogin: user.lastLogin,
						displayName: user.displayName,
						uid: user.uid,
					};
					this.$store.dispatch("login", userProfile);
					this.redirectRouter();
				}
			},
			addNewUserToDb(user) {
				return db
					.collection("users")
					.doc(user.uid)
					.set({
						email: user.email,
						lastLogin: new Date(),
						displayName: user.displayName,
						uid: user.uid,
					});
			},
			createUser(user, e) {
				e.preventDefault();
				this.error = null;

				fb.auth()
					.createUserWithEmailAndPassword(user.email, user.password)
					.then((userResponse) => {
						user.uid = userResponse.user.uid;
						this.addNewUserToDb(user).then(() => {
							this.handleLogin(user);
						});
					})
					.catch((error) => {
						this.error = error;
					});
			},

			login(user, e) {
				e.preventDefault();
				this.error = null;

				// try signing the user in
				fb.auth()
					.signInWithEmailAndPassword(user.email, user.password)
					.then((userResponse) => {
						// check if there is a record of this user(email) in database and get values.
						this.getUserCredentialsFromDatabase(userResponse.user.uid)
							.then((doc) => {
								if (doc.exists) {
									user.uid = userResponse.user.uid;
									user.displayName = doc.data().displayName;
									this.handleLogin(user);
									console.log("Document data:", doc.data());
								}
							})
							.catch((error) => {
								this.error = error;
								console.log("Error getting document:", error);
							});
					})

					.catch((error) => {
						this.error = error;
						this.isLoading = false;
						this.logErr = "Ongeldig e-mailadres of wachtwoord.";
					});
			},

			redirectRouter() {
				if (this.routerRedirect) {
					this.$router.push({ path: this.routerRedirect });
				} else {
					this.$router.push({ path: "/" });
				}
			},

			sendForgotPassword(e) {
				e.preventDefault();
				const that = this;
				const emailAddress = this.userEmailForgot;
				if (emailAddress) {
					fb.auth()
						.sendPasswordResetEmail(emailAddress)
						.then(function() {
							that.forgotMessage = "Gelukt, we hebben een e-mail verzonden naar het opgegeven e-mailadres met verdere instructies.";
						})
						.catch(function() {
							that.forgotMessage = "Error. We konden jouw wachtwoord niet resetten. Probeer het later opnieuw.";
						})
						.finally(function() {
							that.userEmailForgot = null;
							that.isForgot = false;
						});
				}
			},

			getUserCredentialsFromDatabase(uid) {
				return db
					.collection("users")
					.doc(uid)
					.get();
			},
		},
		beforeRouteEnter(to, from, next) {
			next((vm) => {
				vm.routerRedirect = to.query.redirect;
			});
		},
		watch: {
			registrationActive() {
				this.error = null;
			},
		},
	};
</script>

<style scoped>
	.page {
		background: #f5f5f5;
		width: 100%;
		height: 100vh;
		padding-top: 40px;
	}

	.login-box {
		width: 400px;
		margin: 0 auto;
		padding: 40px;
		background: #fff;
		box-shadow: 2px 10px 10px rgba(0, 0, 0, 0.03);
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		row-gap: 20px;
	}

	.form {
		display: flex;
		flex-direction: column;
		row-gap: 16px;
	}

	.f-row {
		display: flex;
		flex-direction: column;
		text-align: left;
		gap: 8px;
	}

	h1 {
		margin: 0;
	}

	label {
		font-weight: 600;
		font-size: 14px;
		font-family: system-ui;
	}

	input {
		font-family: system-ui;
		padding: 19px 25px;
		font-size: 16px;
		border: 2px solid #eaeaea;
		background: white;
		border-radius: 10px;
		outline: 0;
		transition: border-color 0.2s ease;
	}
	input:focus {
		border-color: var(--c-one);
	}
	.errors {
		color: var(--c-three);
	}
</style>
