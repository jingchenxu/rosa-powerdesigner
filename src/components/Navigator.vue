<template>
  <div class="navigator">
    <Button icon="ios-folder-open" @click="handleOpenPDM" type="primary">打开PDM</Button>
    <Dropdown @on-click="handleTemplateClick" transfer-class-name="expand-container">
      <Button type="primary">
        请选择对应模板
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem :key="template.templateid" :name="template.templateid" v-for="template in getTemplateList">
          {{template.templatename}}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Button icon="md-copy" @click="handleCopy" type="primary">复制到粘贴板</Button>
    <Button icon="ios-share-alt" @click="handleExport" type="primary">导出代码</Button>
    <Button icon="ios-albums" @click="handleTemplate" type="primary">模板管理</Button>
    <Input style="width: auto;" @on-enter="handleSearch" @on-clear="handleSearch" v-model="searchStr" clearable placeholder="请输入查询条件"></Input>
    <Modal v-model="modal" fullscreen footer-hide title="模板管理">
      <Tabs value="name1">
        <TabPane label="本地模板" name="name1">
          <Form ref="searchParams" :model="searchParams" inline>
            <FormItem>
              <Button icon="md-add" type="primary" @click="addTemplate">新增模板</Button>
              <Modal v-model="formModal" width="80" footer-hide title="新增模板">
                <Form :model="detailForm" :label-width="80">
                  <FormItem label="模板名称">
                    <Input v-model="detailForm.templatename" placeholder="请输入模板名称"></Input>
                  </FormItem>
                  <Row>
                    <Col span="12">
                    <FormItem label="代码语言">
                      <Select @on-change="handleLanguageChange" label-in-value v-model="detailForm.codelanguage">
                        <Option v-for="item in codelanguage" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="文件后缀">
                      <Input disabled v-model="detailForm.fileextension" placeholder="请输入文件后缀"></Input>
                    </FormItem>
                    </Col>
                  </Row>
                  <FormItem label="模板简介">
                    <Input v-model="detailForm.bref" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" placeholder="请输入模板简介"></Input>
                  </FormItem>
                  <FormItem label="模板">
                    <Input v-model="detailForm.template" type="textarea" :rows="12" placeholder="请输入模板"></Input>
                  </FormItem>
                  <FormItem>
                    <Button @click="addConfirm" type="primary">保存</Button>
                    <Button @click="cancelConfirm" style="margin-left: 8px">取消</Button></Button>
                  </FormItem>
                </Form>
              </Modal>
            </FormItem>
          </Form>
          <Table :columns="columns1" size="small" stripe :data="getTemplateList"></Table>
        </TabPane>
        <TabPane label="线上模板" name="name2">
          <online-template />
        </TabPane>
      </Tabs>
    </Modal>
    <div @click="login" class="login-container">
      <Avatar shape="square" :src="getCurrentUser.avatar" icon="ios-person" />
    </div>
    <Modal v-model="loginModal" footer-hide title="登录">
      <Tabs type="card">
        <TabPane label="登录">
          <Form :model="loginParams" :label-width="80">
            <FormItem label="用户名">
              <Input v-model="loginParams.nickname" placeholder="请输入用户名"></Input>
            </FormItem>
            <FormItem label="密码">
              <Input v-model="loginParams.password" type="password" placeholder="请输入密码"></Input>
            </FormItem>
            <FormItem>
              <Button @click="handleLogin" type="primary">登录</Button>
              <Button @click="handleGithubLogin" type="primary">github登录</Button>
              <Button style="margin-left: 8px">Cancel</Button>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="注册">
          <Form :model="registerParams" :label-width="80">
            <FormItem label="用户名">
              <Input v-model="registerParams.nickname" placeholder="请输入用户名"></Input>
            </FormItem>
            <FormItem label="邮箱">
              <Input v-model="registerParams.email" placeholder="请输入邮箱"></Input>
            </FormItem>
            <FormItem label="密码">
              <Input v-model="registerParams.password" type="password" placeholder="请输入密码"></Input>
            </FormItem>
            <FormItem>
              <Button @click="handleRegister" type="primary">注册</Button>
              <Button style="margin-left: 8px">Cancel</Button>
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
    </Modal>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import axios from 'axios'
import handleLocalStorage from '../utils/handleLocalStorage'
import OnlineTemplate from './OnlineTemplate'
import getMAC from 'getmac'
const { ipcRenderer, clipboard } = window.require('electron')

class RosaTemplate {
  constructor () {
    this.templateid = new Date().getTime()
    this.templatename = ''
    this.bref = ''
    this.templatestatus = 0
    this.author = ''
    this.authorname = ''
    this.templatetype = 0
    this.codelanguage = 1
    this.codelanguagename = 'java'
    this.fileextension = 'java'
    this.template = ''
    this.times = 0
  }
}

export default {
  name: 'Navigator',
  components: {
    OnlineTemplate
  },
  data () {
    return {
      searchStr: '',
      modal: false,
      formModal: false,
      loginModal: false,
      searchParams: {},
      detailForm: {},
      loginParams: {},
      registerParams: {},
      columns1: [
        {
          title: '序号',
          width: 50,
          type: 'index'
        },
        {
          title: '模板名称',
          key: 'templatename'
        },
        {
          title: '模板简介',
          key: 'bref'
        },
        {
          title: '代码语言',
          key: 'codelanguagename'
        },
        {
          title: '文件后缀',
          key: 'fileextension'
        },
        {
          title: '操作',
          width: 270,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'i-button',
                {
                  style: {
                    marginRight: '5px'
                  },
                  props: {
                    type: 'primary'
                  },
                  on: {
                    click: () => {
                      this.handleEdit(params.row)
                    }
                  }
                },
                '修改'
              ),
              h(
                'i-button',
                {
                  style: {
                    marginRight: '5px'
                  },
                  props: {
                    type: 'primary'
                  },
                  on: {
                    click: () => {
                      this.handleUpload(params.row, params.index)
                    }
                  }
                },
                '上传'
              ),
              h(
                'i-button',
                {
                  props: {
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.handleDelete(params.row)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      codelanguage: [
        {
          value: 1,
          editorType: 'text/x-java',
          label: 'java'
        },
        {
          value: 2,
          editorType: 'text/x-vue',
          label: 'vue'
        },
        {
          value: 3,
          editorType: 'text/x-sql',
          label: 'sql'
        },
        {
          value: 4,
          editorType: 'text/javascript',
          label: 'js'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getCurrentTable', 'getTemplateList', 'getActiveTemplate', 'getCurrentUser', 'getToken']),
    getUserId () {
      return this.getCurrentUser.userid ? this.getCurrentUser.userid : getMAC()
    }
  },
  methods: {
    handleOpenPDM () {
      let input = document.createElement('input')
      input.type = 'file'
      input.accept = '.pdm'
      input.click()
      input.onchange = e => {
        ipcRenderer.send('get-file-path', e.target.files[0].path)
      }
    },
    handleExport () {
      const { fileextension } = { ...this.getActiveTemplate }
      this.$Modal.confirm({
        render: (h) => {
          return h('Input', {
            props: {
              value: this.value,
              autofocus: true,
              placeholder: '请输入文件名'
            },
            on: {
              input: (fileName) => {
                this.value = fileName
              }
            }
          })
        },
        onOk: () => {
          let file = {
            code: this.genCode(),
            fileType: fileextension,
            fileName: this.value
          }
          ipcRenderer.send('code-export', file)
        }
      })
    },
    handleCopy () {
      clipboard.writeText(this.genCode())
      this.$Message.info('复制成功')
    },
    handleTemplate () {
      this.modal = true
    },
    handleSearch () {
      console.log(`查询字段${this.searchStr}`)
      this.$store.dispatch('FILTERDBLIST', this.searchStr)
    },
    addTemplate () {
      this.detailForm = new RosaTemplate()
      this.formModal = true
    },
    addConfirm () {
      let getTemplateList = this.getTemplateList
      let detailForm = this.detailForm
      let idList = getTemplateList.map(template => template.templateid)
      if (idList.includes(detailForm.templateid)) {
        for (let i = 0; i < getTemplateList.length; i++) {
          let template = getTemplateList[i]
          if (template.templateid === detailForm.templateid) {
            getTemplateList[i] = detailForm
          }
        }
      } else {
        getTemplateList.push(detailForm)
      }
      this.$store.dispatch('UPDATETEMPLATELIST', getTemplateList)
      ipcRenderer.send('updateTemplateList', getTemplateList)
      this.formModal = false
    },
    handleEdit (row) {
      this.detailForm = row
      this.formModal = true
    },
    handleUpload (row, index) {
      axios.post(`${window.process.env.ELECTRON_APP_BASE_API}upload_rosa_template`, row, {
        headers: {
          token: this.getToken
        }
      }).then(res => {
        let result = res.data
        if (result.success) {
          this.$Message.success(result.msg)
          let getTemplateList = _.cloneDeep(this.getTemplateList)
          getTemplateList[index] = result.data
          this.$store.dispatch('UPDATETEMPLATELIST', getTemplateList)
          ipcRenderer.send('updateTemplateList', getTemplateList)
        } else {
          this.$Message.error(result.msg)
        }
      })
    },
    handleDelete (row) {
      let getTemplateList = this.getTemplateList.filter(
        template => template.templateid !== row.templateid
      )
      this.$store.dispatch('UPDATETEMPLATELIST', getTemplateList)
      ipcRenderer.send('updateTemplateList', getTemplateList)
    },
    genCode () {
      const { template } = { ...this.getActiveTemplate }
      let compiled = _.template(template)
      let code = compiled(this.getCurrentTable)
      return code
    },
    handleTemplateClick (templateid) {
      this.getTemplateList.forEach(template => {
        if (template.templateid === templateid) {
          this.$store.dispatch('UPDATEACTIVETEMPLATE', template)
        }
      })
      const { codelanguage } = { ...this.getActiveTemplate }
      let code = this.genCode()
      switch (codelanguage) {
        case 1:
          this.$parent.$parent.$parent.$refs.page.setCode(code, 'text/x-java')
          break
        case 2:
          this.$parent.$parent.$parent.$refs.page.setCode(code, 'text/x-vue')
          break
        case 3:
          this.$parent.$parent.$parent.$refs.page.setCode(code, 'text/x-sql')
          break
        case 4:
          this.$parent.$parent.$parent.$refs.page.setCode(
            code,
            'text/javascript'
          )
          break
        default:
          this.$Message.error('模板中未指定代码语言')
      }
    },
    handleLanguageChange (ob) {
      this.detailForm.codelanguagename = ob.label
      this.detailForm.fileextension = ob.label
    },
    login () {
      // TODO 需要判断用户有没有登录
      this.loginModal = true
    },
    handleLogin () {
      axios.post(`${window.process.env.ELECTRON_APP_BASE_API}rosa_login`, this.loginParams).then(res => {
        let result = res.data
        if (result.success) {
          this.$store.dispatch('UPDATECURRENTUSER', result.data)
          this.loginModal = false
          this.$Message.success(result.msg)
          handleLocalStorage('set', 'currentUser', JSON.stringify(result.data))
        } else {
          this.$Message.error(result.msg)
        }
      })
    },
    handleGithubLogin () {
      ipcRenderer.send('githubLogin')
      // location.href = 'https://github.com/login/oauth/authorize?client_id=Iv1.1f53d92f0acfd153&state=STATE&redirect_uri=http://www.deepwater.tech/codekeep/api/v1.0/github_callback;'
    },
    handleRegister () {
      axios.post(`${window.process.env.ELECTRON_APP_BASE_API}rosa_register`, this.registerParams).then(res => {
        let result = res.data
        if (result.success) {
          this.$store.dispatch('UPDATECURRENTUSER', result.data)
          this.loginModal = false
          this.$Message.success(result.msg)
          handleLocalStorage('set', 'currentUser', JSON.stringify(result.data))
        } else {
          this.$Message.error(result.msg)
        }
      })
    },
    cancelConfirm () {
      this.formModal = false
    }
  },
  mounted () {
    let socket
    // 使用mac编号作为身份凭证
    if (socket != null) {
      socket.close()
      socket = null
    }
    socket = new WebSocket(`ws://118.24.155.81:2048/codekeep/imserver/${this.getUserId}`)
    // 打开事件
    socket.onopen = function () {
      console.log('websocket已打开')
      // socket.send("这是来自客户端的消息" + location.href + new Date());
    }
    // 获得消息事件
    socket.onmessage = message => {
      console.log(message.data)
      let result = JSON.parse(message.data)
      if (result.success) {
        this.loginModal = false
        this.$Message.success(result.msg)
        this.$store.dispatch('UPDATECURRENTUSER', result.data)
        handleLocalStorage('set', 'currentUser', JSON.stringify(result.data))
      } else {
        this.$Message.error(result.msg)
      }
      // 发现消息进入    开始处理前端触发逻辑
    }
    // 关闭事件
    socket.onclose = function () {
      console.log('websocket已关闭')
    }
    // 发生了错误事件
    socket.onerror = function () {
      console.log('websocket发生了错误')
    }
  }
}
</script>

<style lang="less" scoped>
.navigator {
  height: 50px;
  text-align: left;
  line-height: 50px;
  padding: 0 10px;
  button {
    margin-right: 5px;
  }
  .login-container {
    height: 50px;
    float: right;
  }
}
</style>
