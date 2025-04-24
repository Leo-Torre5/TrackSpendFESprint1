// store/index.js
import { createStore } from "vuex";

export default createStore({
    state: {
        authenticated: false,
        user: null, 
        token: null
    },
    mutations: {
        SET_AUTHENTICATED(state, value) {
            state.authenticated = value;
        },
        SET_TOKEN(state, token) {
            state.token = token;
        },
        // Add this mutation
        SET_USER(state, user) {
            state.user = user;
        },
    },
    actions: {
        // Optional: Add actions if needed
    },
    getters: {
        // Optional: Add getters if needed
    },
});
