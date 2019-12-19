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
          <div @click="handleChangeSetting" class="setting-container">
            <Icon type="ios-settings" />
          </div>
          </Col>
        </Row>
      </Footer>
    </Layout>
    <Modal v-model="showSetting" footer-hide title="设置软件" @on-ok="handleUpdateSetting">
      <Tabs type="card">
        <TabPane label="基础设置">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="Name" prop="name">
              <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
            </FormItem>
            <FormItem label="E-mail" prop="mail">
              <Input v-model="formValidate.mail" placeholder="Enter your e-mail"></Input>
            </FormItem>
            <FormItem label="City" prop="city">
              <Select v-model="formValidate.city" placeholder="Select your city">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
              </Select>
            </FormItem>
            <FormItem label="Date">
              <Row>
                <Col span="11">
                <FormItem prop="date">
                  <DatePicker type="date" placeholder="Select date" v-model="formValidate.date"></DatePicker>
                </FormItem>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                <FormItem prop="time">
                  <TimePicker type="time" placeholder="Select time" v-model="formValidate.time"></TimePicker>
                </FormItem>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="Gender" prop="gender">
              <RadioGroup v-model="formValidate.gender">
                <Radio label="male">Male</Radio>
                <Radio label="female">Female</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="Hobby" prop="interest">
              <CheckboxGroup v-model="formValidate.interest">
                <Checkbox label="Eat"></Checkbox>
                <Checkbox label="Sleep"></Checkbox>
                <Checkbox label="Run"></Checkbox>
                <Checkbox label="Movie"></Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem label="Desc" prop="desc">
              <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
              <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="快捷键">标签二的内容</TabPane>
        <TabPane label="关于">
          <Card dis-hover :bordered="false">
            <div style="text-align:center">
              <h3>版权信息</h3>
              <p>这里显示版权信息这里显示版权信息这里显示版权信息这里显示版权信息这里显示版权信息这里显示版权信息这里显示版权信息这里显示版权信息这里显示版权信息这里显示版权信息这里显示版权信息这里显示版权信息这里显示版权信息</p>
            </div>
          </Card>
        </TabPane>
      </Tabs>
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
    TableSetting
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
    handleChangeSetting () {
      this.showSetting = true
    },
    handleUpdateSetting () {
      console.log('更新系统配置信息')
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
