// store/index.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    authenticated: !!localStorage.getItem('access_token')
  },
  mutations: {
    SET_AUTHENTICATED(state, value) {
      state.authenticated = value
    }
  }
})
