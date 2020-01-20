<template>
  <div id="app">
    <Layout style="width: 100%;height: 100%;">
      <Header>
        <Navigator />
      </Header>
      <Layout>
        <Split ref="split" :min="0.25" :max="0.5" v-model="split">
          <div slot="left">
            <!-- 左侧菜单栏目 -->
            <Sider width="auto" :style="{height: siderHeihgt+'px'}">
              <table-menu :menu="getDBList" />
            </Sider>
          </div>
          <div slot="right">
            <Content :style="{height: siderHeihgt+'px'}">
              <router-view ref="page" />
            </Content>
          </div>
        </Split>
      </Layout>
      <Footer>
        <Row>
          <Col span="20">
          <Breadcrumb v-if="getCurrentDB.length > 0">
            <BreadcrumbItem>
              <Icon type="ios-home-outline"></Icon> {{getCurrentDB[0]}}
            </BreadcrumbItem>
            <BreadcrumbItem v-if="getCurrentTable">
              <Icon type="logo-buffer"></Icon> <span class="table-name" @click="handleTableSetting">{{getCurrentTable['tablecode']}}</span>
            </BreadcrumbItem>
          </Breadcrumb>
          <span v-else>
            请选择数据库
          </span>
          </Col>
          <Col span="4">
          <div @click="updateAppSetting" class="setting-container">
            <Icon type="ios-settings" />
          </div>
          </Col>
        </Row>
      </Footer>
    </Layout>
    <Modal v-model="showSetting" scrollable class-name="vertical-center-modal" footer-hide title="设置软件" @on-ok="updateAppConfig">
      <app-setting></app-setting>
    </Modal>
    <Modal :width="800" v-model="showTableSetting" title="代码生成设置">
      <table-setting />
    </Modal>
  </div>
</template>

<script>
import Navigator from './components/Navigator'
import TableMenu from './components/TableMenu'
import TableSetting from './components/TableSetting'
import AppSetting from './components/AppSetting'
import { mapGetters } from 'vuex'
const { ipcRenderer } = window.require('electron')

export default {
  name: 'App',
  computed: {
    ...mapGetters(['getDBList', 'getDBMap', 'getCurrentDB', 'getCurrentTable'])
  },
  components: {
    Navigator,
    TableMenu,
    TableSetting,
    AppSetting
  },
  data () {
    return {
      siderHeihgt: document.body.clientHeight - 86,
      showSetting: false,
      formValidate: {},
      ruleValidate: {},
      showTableSetting: false,
      split: 0.3
    }
  },
  beforeCreate () {
    ipcRenderer.send('app-init', 'ping')
  },
  mounted () {
    window.addEventListener('resize', () => {
      this.siderHeihgt = document.body.clientHeight - 86
      // 更新编辑器尺寸
      if (this.$refs.page.resizeEditor) {
        this.$refs.page.resizeEditor()
      }
      // 更新split样式
      this.$refs.split.computeOffset()
    })
    ipcRenderer.on('update-dbmap', (event, key, dbList) => {
      this.$store.dispatch('UPDATEDBMAP', { key, dbList })
    })
  },
  methods: {
    updateAppSetting () {
      this.showSetting = true
    },
    updateAppConfig () {
      this.$Message.info('更新软件配置')
    },
    handleTableSetting () {
      this.showTableSetting = true
    }
  }
}
</script>

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  .ivu-layout {
    .ivu-layout-header {
      height: 50px;
      background-color: #dadada;
      padding: 0;
    }
    .ivu-layout-sider {
      width: 100%;
      overflow-y: scroll;
    }
    .ivu-layout-footer {
      height: 36px;
      background-color: #dadada;
      line-height: 36px;
      padding: 0 10px;
      .setting-container {
        width: 36px;
        height: 36px;
        text-align: center;
        float: right;
        font-size: 20px;
        i:hover {
          cursor: pointer;
        }
      }
      .table-name:hover {
        cursor: pointer;
      }
    }
  }
}
@import "./views/global.less";
</style>
