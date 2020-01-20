import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

class AppConfig {
  constructor () {
    // 主题颜色
    this.themeColor = ''
    // 数据库类型
    this.dbType = ''
  }
}

const state = new AppConfig()

const getters = {
  getThemeColor (state) {
    return state.themeColor
  },
  getDbType (state) {
    return state.dbType
  }
}

const mutations = {
  updateThemeColor (state, themeColor) {
    state.themeColor = themeColor
  }
}
