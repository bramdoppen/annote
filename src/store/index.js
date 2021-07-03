import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    user: null,
  },
  mutations: {
    login(state, user) {
			state.user = {
				uid: user.uid,
				displayName: user.displayName,
				email: user.email,
				lastLogin: user.lastLogin,
			};
		},

    signOut(state) {
      state.user = null;
    }
  },

  actions: {
    login({ commit }, user) {
      commit('login', user);
    },

    signOut({ commit }) {
      commit('signOut');
    }
  },

  modules: {
  },

  getters: {
    userId: state => {
      return state.user.uid;
    }
  },

  plugins: [createPersistedState()],
})
