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
  },
  actions: {
    login({ commit }, user) {
      commit('login', user)
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
