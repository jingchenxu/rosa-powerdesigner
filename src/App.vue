<template>
  <div id="app">
    <Layout style="width: 100%;height: 100%;">
      <Header>
        <Navigator />
      </Header>
      <Layout>
        <Split ref="split" :min="0.2" :max="0.7" v-model="split">
          <div slot="left">
            <Sider data-step="2" data-intro="此处展示pdm文件中的数据，选择对应的表进行操作！" width="auto" :style="{height: siderHeihgt+'px'}">
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
          <Col data-step="7" data-intro="展示当前选中的数据库及数据库表！" span="20">
          <Breadcrumb v-if="getCurrentDB">
            <BreadcrumbItem>
              <Icon type="ios-home-outline"></Icon> {{getCurrentDB.name}}
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
            <Icon data-step="8" data-intro="软件设置！" type="ios-settings" />
          </div>
          </Col>
        </Row>
      </Footer>
    </Layout>
    <Modal v-model="showSetting" scrollable class-name="vertical-center-modal" footer-hide title="软件设置" @on-ok="updateAppConfig">
      <app-setting></app-setting>
    </Modal>
    <Modal :width="800" footer-hide v-model="showTableSetting" :title="modalTitle">
      <table-setting />
    </Modal>
    <foo-modal name="downloadProgress" transition="scale" :height="260" :width="260" classes="download-progress">
      <span>下载进度</span>
        <i-circle :size="260" :percent="percent">
        <span class="demo-Circle-inner" style="font-size:24px">{{percent | fixTwoPoint}}%</span>
        </i-circle>
    </foo-modal>
  </div>
</template>

<script>
import Navigator from './components/Navigator'
import TableMenu from './components/TableMenu'
import TableSetting from './components/TableSetting'
import AppSetting from './components/AppSetting'
import { mapGetters } from 'vuex'
import handleLocalStorage from './utils/handleLocalStorage'
import introJs from 'intro.js'
const { ipcRenderer } = window.require('electron')

export default {
  name: 'App',
  computed: {
    ...mapGetters(['getDBList', 'getDBMap', 'getCurrentDB', 'getCurrentTable']),
    modalTitle () {
      return `${this.getCurrentTable.tablecode}(${this.getCurrentTable.tablename})`
    }
  },
  filters: {
    fixTwoPoint (value) {
      return value.toFixed(2)
    }
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
      split: 0.2,
      percent: 0
    }
  },
  beforeCreate () {
    ipcRenderer.send('app-init', 'ping')
    // FIXME 处理生产模式下BASE_API丢失问题
    if (!window.process.env.ELECTRON_APP_BASE_API) {
      window.process.env.ELECTRON_APP_BASE_API = 'http://www.deepwater.tech/codekeep/api/v1.0/'
    }
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
    ipcRenderer.on('updateTemplateList', (event, templateList) => {
      this.$store.dispatch('UPDATETEMPLATELIST', templateList)
    })
    ipcRenderer.on('updateAppConfig', (event, appConfig) => {
      this.$store.dispatch('UPDATEAPPCONFIG', appConfig)
    })
    ipcRenderer.on('isUpdateNow', () => {
      console.log('监听到了更新请求')
      // 弹出弹框判断是否要更新
      this.$Modal.confirm({
        title: '确认是否更新',
        content: '请确认是否更新',
        onOk: () => {
          ipcRenderer.send('isUpdateNow')
        },
        onCancel: () => {
          this.$Message.info('Clicked cancel')
        }
      })
    })
    ipcRenderer.on('downloadProgress', (event, progressObj) => {
      console.dir(progressObj)
      this.percent = progressObj.percent
      this.$modal.show('downloadProgress')
      if (!this.showProgress) {
        this.showProgress = true
      }
    })
    let currentUser = handleLocalStorage('get', 'currentUser')
    if (currentUser) {
      this.$store.dispatch('UPDATECURRENTUSER', JSON.parse(currentUser))
    }
    ipcRenderer.on('startGuide', () => {
      this.firstIntro()
    })
    ipcRenderer.on('message', (event, message) => {
      this.$Message.info(message)
    })
    ipcRenderer.send('checkForUpdate')
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
    },
    firstIntro () {
      // eslint-disable-next-line no-undef
      introJs().setOptions({
        /* 下一步按钮的显示名称 */
        nextLabel: 'Next &rarr;',
        /* 上一步按钮的显示名称 */
        prevLabel: '&larr; Back',
        /* 跳过按钮的显示名称 */
        skipLabel: 'Skip',
        /* 结束按钮的显示名称 */
        doneLabel: 'Done',
        /* 引导说明框相对高亮说明区域的位置 */
        tooltipPosition: 'bottom',
        /* 引导说明文本框的样式 */
        tooltipClass: '',
        /* 说明高亮区域的样式 */
        highlightClass: '',
        /* 是否使用键盘Esc退出 */
        exitOnEsc: true,
        /* 是否允许点击空白处退出 */
        exitOnOverlayClick: true,
        /* 是否显示说明的数据步骤 */
        showStepNumbers: true,
        /* 是否允许键盘来操作 */
        keyboardNavigation: true,
        /* 是否按键来操作 */
        showButtons: true,
        /* 是否使用点点点显示进度 */
        showBullets: true,
        /* 是否显示进度条 */
        showProgress: false,
        /* 是否滑动到高亮的区域 */
        scrollToElement: true,
        /* 遮罩层的透明度 */
        overlayOpacity: 0.8,
        /* 当位置选择自动的时候，位置排列的优先级 */
        positionPrecedence: ['bottom', 'top', 'right', 'left'],
        /* 是否禁止与元素的相互关联 */
        disableInteraction: false,
        /* 默认提示位置 */
        hintPosition: 'top-middle',
        /* 默认提示内容 */
        hintButtonLabel: 'Got it'
      }).oncomplete(function () {
        // 点击跳过按钮后执行的事件
      }).onexit(function () {
        // 点击结束按钮后， 执行的事件
      }).start()
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
      background-color: white;
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
.download-progress {
    background-color: transparent;
    border-radius: 100%;
    box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.4);
}
</style>
