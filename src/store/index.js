// store/index.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    authenticated: false,
    user: null  // Add user state
  },
  mutations: {
    SET_AUTHENTICATED(state, value) {
      state.authenticated = value
    },
    // Add this mutation
    SET_USER(state, user) {
      state.user = user
    }
  },
  actions: {
    // Optional: Add actions if needed
  },
  getters: {
    // Optional: Add getters if needed
  }
})
