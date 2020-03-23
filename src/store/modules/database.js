import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  dbMap: new Map(),
  dbList: [],
  currentTable: null,
  currentDB: [],
  codeConfig: [],
  templateList: [],
  activeTemplate: {},
  currentUser: {}
}

const getters = {
  getDBList (state) {
    return state.dbList
  },
  getDBMap (state) {
    return state.dbMap
  },
  getCurrentTable (state) {
    if (state.currentTable) {
      return state.currentTable
    } else {
      return {
        columns: []
      }
    }
  },
  getCurrentDB (state) {
    return state.currentDB
  },
  getCodeConfig (state) {
    return state.codeConfig
  },
  getTemplateList (state) {
    return state.templateList
  },
  getActiveTemplate (state) {
    return state.activeTemplate
  },
  getCurrentUser (state) {
    return state.currentUser
  },
  getToken (state) {
    return state.currentUser.token
  }
}

const mutations = {
  updateDBMap (state, dbInfo) {
    state.dbMap.set(dbInfo.key, dbInfo.dbList)
    state.dbList = []
    state.dbMap.forEach(item => {
      item.tables.map(table => {
        table['show'] = true
        return table
      })
      state.dbList.push(item)
    })
    const { dbList } = { ...state }
    if (dbList.length > 0) {
      state.currentDB = dbList[0]
      state.currentTable = dbList[0].tables[0]
    }
  },
  updateCurrentTable (state, currentTable) {
    state.currentTable = currentTable
  },
  updateCurrentDB (state, currentDB) {
    state.currentDB = currentDB
  },
  updateCodeConfig (state, codeConfig) {
    state.codeConfig = codeConfig
  },
  filterDBList (state, searchStr) {
    // TODO 修改列表属性
    state.dbList.map(db => {
      db.tables.map(table => {
        if (table.tablecode.toLowerCase().indexOf(searchStr.toLowerCase()) > -1) {
          table.show = true
        } else {
          table.show = false
        }
        return table
      })
      return db
    })
  },
  updateTemplateList (state, templateList) {
    state.templateList = templateList
  },
  updateActiveTemplate (state, activeTemplate) {
    state.activeTemplate = activeTemplate
  },
  updateCurrentUser (state, currentUser) {
    state.currentUser = currentUser
  }
}

const actions = {
  UPDATEDBMAP (context, dbInfo) {
    context.commit('updateDBMap', dbInfo)
  },
  UPDATECURRENTTABLE (context, currentTable) {
    context.commit('updateCurrentTable', currentTable)
  },
  UPDATECURRENTDB (context, currentDB) {
    context.commit('updateCurrentDB', currentDB)
  },
  UPDATECODECONFIG (context, codeConfig) {
    context.commit('updateCodeConfig', codeConfig)
  },
  FILTERDBLIST (context, searchStr) {
    context.commit('filterDBList', searchStr)
  },
  UPDATETEMPLATELIST (context, templateList) {
    context.commit('updateTemplateList', templateList)
  },
  UPDATEACTIVETEMPLATE (context, activeTemplate) {
    context.commit('updateActiveTemplate', activeTemplate)
  },
  UPDATECURRENTUSER (context, currentUser) {
    context.commit('updateCurrentUser', currentUser)
  }
}

const database = {
  state,
  getters,
  mutations,
  actions
}

export default database
