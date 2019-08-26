<template>
  <div class="navigator">
    <Button @click="handleOpenPDM" type="primary">打开PDM</Button>
    <Button @click="handleGenClass" type="primary">生成class文件</Button>
    <Button @click="handleGenColumn" type="primary">生成表头文件</Button>
    <Button @click="handleGenRule" type="primary">生成表单校验规则</Button>
    <Button @click="handleGenForm" type="primary">生成表单文件</Button>
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
  components: {
    FormConfig
  },
  methods: {
    handleOpenPDM () {
      let input = document.createElement('input')
      input.type = 'file'
      input.accept = '.pdm'
      input.click()
      input.onchange = (e) => {
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
    handleGenForm () {
      // TODO 弹出一些表单生成的额外配置
      this.$Modal.confirm({
        title: '表单生成配置',
        render: (h) => {
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
