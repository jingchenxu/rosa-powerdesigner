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
          <Button @click="handleGenRule" type="primary">生成表单校验规则</Button>
        </DropdownItem>
        <DropdownItem>
          <Button @click="handleGenForm" type="primary">生成表单文件</Button>
        </DropdownItem>
        <DropdownItem>
          <Button @click="handleGenJavaClass" type="primary">生成java类</Button>
        </DropdownItem>
        <DropdownItem>
          <Button @click="handleGenSearchSql" type="primary">生成search sql</Button>
        </DropdownItem>
        <DropdownItem>
          <Button @click="handleGenGetSql" type="primary">生成get sql</Button>
        </DropdownItem>
        <DropdownItem>
          <Button @click="handleGenSaveSql" type="primary">生成save sql</Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Button @click="handleExport" type="primary">导出代码</Button>
    <Button @click="handlePreview" type="primary">预览表单页</Button>
    <Input style="width: auto;" @on-enter="handleSearch" @on-clear="handleSearch" v-model="searchStr" clearable placeholder="请输入查询条件"></Input>
  </div>
</template>

<script>
import FormConfig from './FormConfig'
import _ from 'lodash'
const { ipcRenderer } = window.require('electron')

export default {
  name: 'Navigator',
  data () {
    return {
      searchStr: ''
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
      this.$parent.$parent.$parent.$refs.page.genGetSql()
    },
    handleGenSaveSql () {
      this.$parent.$parent.$parent.$refs.page.genSaveSql()
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
    handleSearch () {
      console.log(`查询字段${this.searchStr}`)
      this.$store.dispatch('FILTERDBLIST', this.searchStr)
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
