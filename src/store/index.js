import Vue from 'vue'
import Vuex from 'vuex'
import database from './modules/database'
import appconfig from './modules/appconfig'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    database,
    appconfig
  }
})
