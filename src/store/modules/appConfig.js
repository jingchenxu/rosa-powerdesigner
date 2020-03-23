import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  appConfig: {
    appTheme: 'theme1',
    editorTheme: 'darcula'
  }
}

const getters = {
  getAppConfig (state) {
    return state.appConfig
  },
  getAppTheme (state) {
    return state.appConfig.appTheme
  },
  getEditorTheme (state) {
    return state.appConfig.editorTheme
  }
}

const mutations = {
  updateAppConfig (state, appConfig) {
    state.appConfig = appConfig
  },
  updateAppTheme (state, appTheme) {
    state.appConfig.appTheme = appTheme
  },
  updateEditorTheme (state, editorTheme) {
    state.appConfig.editorTheme = editorTheme
  }
}

const actions = {
  UPDATEAPPCONFIG (context, appConfig) {
    context.commit('updateAppConfig', appConfig)
  },
  UPDATEAPPTHEME (context, appTheme) {
    context.commit('updateAppTheme', appTheme)
  },
  UPDATEEDITORTHEME (context, editorTheme) {
    context.commit('updateEditorTheme', editorTheme)
  }
}

const appconfig = {
  state,
  getters,
  mutations,
  actions
}

export default appconfig
