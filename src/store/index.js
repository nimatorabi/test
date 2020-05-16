import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex, axios)

export default new Vuex.Store({
  state: {
    userInfo: {},
    isLoading: false
  },
  getters: {
    UPDATE_INFO: (state) => {
      return state.userInfo;

    },
    IS_LOADING: (state) => {
      console.log("before : ", state);
      return state.isLoading;
    }
  },
  mutations: {
    FETCH_INFO: (state, userinfo) => {
      //console.log("this is :", state.userInfo);
      state.userInfo = userinfo;
      console.log("this is :", state.userInfo);
    },
    LOADING: (state, payload) => {
      state.isLoading = payload;
      console.log("Loading : ", state.isLoading);
    }
  },
  actions: {
    async LOAD_INFO({ commit }) {
      try {
        commit('LOADING', true);
        let response = await axios.get('http://localhost:5000/user');
        commit('FETCH_INFO', response.data);
        commit('LOADING', false);
      } catch (e) {
        console.log(e);
      }
    },
    async post_info({ commit }, values) {
      try {
        commit('LOADING', true);
        await axios.post('http://localhost:5000/user', values);
        commit('LOADING', false);
      } catch (e) {
        console.log(e);
      }
    }
  },
  modules: {
  }
})
