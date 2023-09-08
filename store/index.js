import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user
  },
  getters,
  state: {
    pathId:-1,
  },
  mutations:{
    change(state,num) {
      state.pathId = num;
    }
  }
})

export default store
