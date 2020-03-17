<template>
  <div class="navigator">
    <Button @click="handleOpenPDM" type="primary">打开PDM</Button>
    <Dropdown transfer-class-name="expand-container">
      <Button type="primary">
        选择生成操作
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem>
          <Button @click="handleGenClass" type="primary">生成class文件</Button>
        </DropdownItem>
        <DropdownItem>
          <Button @click="handleGenColumn" type="primary">生成表头文件</Button>
        </DropdownItem>
        <DropdownItem>
          <Button @click="handleGenRule" type="primary"
            >生成表单校验规则</Button
          >
        </DropdownItem>
        <DropdownItem>
          <Button @click="handleGenForm" type="primary">生成表单文件</Button>
        </DropdownItem>
        <DropdownItem>
          <Button @click="handleGenJavaClass" type="primary">生成java类</Button>
        </DropdownItem>
        <DropdownItem>
          <Button @click="handleGenSearchSql" type="primary"
            >生成search sql</Button
          >
        </DropdownItem>
        <DropdownItem>
          <Button @click="handleGenGetSql" type="primary">生成get sql</Button>
        </DropdownItem>
        <DropdownItem>
          <Button @click="handleGenSaveSql" type="primary">生成save sql</Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Button @click="handleCopy" type="primary">复制到粘贴板</Button>
    <Button @click="handleExport" type="primary">导出代码</Button>
    <Button @click="handlePreview" type="primary">预览表单页</Button>
    <Button @click="handleTemplate" type="primary">模板管理</Button>
    <Input
      style="width: auto;"
      @on-enter="handleSearch"
      @on-clear="handleSearch"
      v-model="searchStr"
      clearable
      placeholder="请输入查询条件"
    ></Input>
    <Modal v-model="modal" fullscreen footer-hide title="模板管理">
      <Tabs value="name1">
        <TabPane label="本地模板" name="name1">
          <Form ref="searchParams" :model="searchParams" inline>
            <FormItem>
              <Button type="primary" @click="addTemplate">新增模板</Button>
              <Modal v-model="formModal" footer-hide title="新增模板">
                <Form :model="detailForm" :label-width="80">
                  <FormItem label="模板名称">
                    <Input
                      v-model="detailForm.templatename"
                      placeholder="请输入模板名称"
                    ></Input>
                  </FormItem>
                  <Row>
                    <Col span="12">
                      <FormItem label="模板代码">
                        <Input
                          v-model="detailForm.codelanguage"
                          placeholder="请输入模板代码"
                        ></Input>
                      </FormItem>
                    </Col>
                    <Col span="12">
                      <FormItem label="文件后缀">
                        <Input
                          v-model="detailForm.fileextension"
                          placeholder="请输入文件后缀"
                        ></Input>
                      </FormItem>
                    </Col>
                  </Row>
                  <FormItem label="模板简介">
                    <Input
                      v-model="detailForm.bref"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 5 }"
                      placeholder="请输入模板简介"
                    ></Input>
                  </FormItem>
                  <FormItem label="模板">
                    <Input
                      v-model="detailForm.template"
                      type="textarea"
                      :rows="12"
                      placeholder="请输入模板"
                    ></Input>
                  </FormItem>
                  <FormItem>
                    <Button @click="addConfirm" type="primary">保存</Button>
                    <Button @click="cancelConfirm" style="margin-left: 8px">取消</Button></Button>
                  </FormItem>
                </Form>
              </Modal>
            </FormItem>
          </Form>
          <Table :columns="columns1" size="small" :data="getTemplateList"></Table>
        </TabPane>
        <TabPane label="线上模板" name="name2">标签二的内容</TabPane>
      </Tabs>
    </Modal>
  </div>
</template>

<script>
import FormConfig from './FormConfig'
import GetSqlConfig from './GetSqlConfig'
import _ from 'lodash'
import { mapGetters } from 'vuex'
const { ipcRenderer } = window.require('electron')

class RosaTemplate {
  constructor () {
    this.templateid = new Date().getTime()
    this.templatename = ''
    this.bref = ''
    this.templatestatus = 0
    this.author = ''
    this.authorname = ''
    this.templatetype = 0
    this.codelanguage = 0
    this.fileextension = ''
    this.template = ''
    this.times = 0
  }
}

export default {
  name: 'Navigator',
  data () {
    return {
      searchStr: '',
      modal: false,
      formModal: false,
      searchParams: {},
      detailForm: {},
      columns1: [
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
          key: 'codelanguage'
        },
        {
          title: '文件后缀',
          key: 'fileextension'
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.handleEdit(params.row)
                  }
                }
              }, '修改'),
              h('i-button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.handleDelete(params.row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getCurrentTable', 'getTemplateList'])
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
    handleGenClass () {
      this.$parent.$parent.$parent.$refs.page.genClass()
    },
    handleGenColumn () {
      this.$parent.$parent.$parent.$refs.page.genColumn()
    },
    handleGenRule () {
      this.$parent.$parent.$parent.$refs.page.genRule()
    },
    handleGenJavaClass () {
      this.$parent.$parent.$parent.$refs.page.genJavaClass()
    },
    handleGenSearchSql () {
      this.$parent.$parent.$parent.$refs.page.genSearchSql()
    },
    handleGenGetSql () {
      this.$Modal.confirm({
        title: '请选择主键',
        render: h => {
          let create = this.$createElement
          return create(GetSqlConfig, {
            ref: 'getSqlConfig',
            props: {
              currentTable: this.getCurrentTable
            }
          })
        },
        onOk: () => {
          let getSqlConfig = _.clone(this.$refs.getSqlConfig)
          this.$parent.$parent.$parent.$refs.page.genGetSql(getSqlConfig.form)
        }
      })
    },
    handleGenSaveSql () {
      this.$parent.$parent.$parent.$refs.page.genSaveSql()
    },
    handleCopy () {
      this.$parent.$parent.$parent.$refs.page.handleCopy()
    },
    handleGenForm () {
      // TODO 弹出一些表单生成的额外配置
      this.$Modal.confirm({
        title: '表单生成配置',
        render: h => {
          let create = this.$createElement
          return create(FormConfig, {
            ref: 'formConfig'
          })
        },
        onOk: () => {
          let formConfig = _.clone(this.$refs.formConfig)
          this.$parent.$parent.$parent.$refs.page.genForm(formConfig.form)
        }
      })
    },
    handleExport () {
      this.$parent.$parent.$parent.$refs.page.handleExport()
    },
    handlePreview () {
      this.$parent.$parent.$parent.$refs.page.handlePreview()
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
    handleDelete (row) {
      let getTemplateList = this.getTemplateList.filter(template => template.templateid !== row.templateid)
      this.$store.dispatch('UPDATETEMPLATELIST', getTemplateList)
      ipcRenderer.send('updateTemplateList', getTemplateList)
    },
    cancelConfirm () {
      this.formModal = false
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
}
</style>
