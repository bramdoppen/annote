import firebase from 'firebase/app'
import "firebase/firestore";
import "firebase/auth";

const prodConfig = {
	apiKey: process.env.VUE_APP_FIREBASE_API_KEY_PROD,
	authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN_PROD,
	projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID_PROD,
	storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET_PROD,
	messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID_PROD,
	appId: process.env.VUE_APP_FIREBASE_APP_ID_PROD,
};

const config = (() => {
	return process.env.NODE_ENV === "development" ? prodConfig : prodConfig;
})();

firebase.initializeApp(config);

// firebase utils
const fb = firebase;
const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;

export { fb, db, auth, currentUser };