<template>
  <div class="editor">
    <textarea ref="mycode" v-model="code"></textarea>
  </div>
</template>

<script>
import 'codemirror/theme/darcula.css'
import 'codemirror/theme/solarized.css'
import 'codemirror/lib/codemirror.css'

import CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/mode/vue/vue'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/sql/sql'

import { mapGetters } from 'vuex'

import CodeGenerator from '../utils/CodeGenerator'

import Vue from 'vue'
const beautifyJs = require('js-beautify').js_beautify

const { ipcRenderer, clipboard } = window.require('electron')

const jdFormatConfig = {
  indent_size: 2,
  end_with_newline: true
}

export default {
  name: 'Editor',
  data () {
    return {
      editor: null,
      code: '//按Ctrl键进行代码提示',
      fileType: 'js',
      fileName: 'default'
    }
  },
  computed: {
    ...mapGetters(['getCodeConfig', 'getCurrentTable'])
  },
  mounted () {
    this.initEditor()
    this.resizeEditor()
  },
  methods: {
    resizeEditor () {
      let codeMirror = document.getElementsByClassName('CodeMirror')
      codeMirror[0].style.height = (document.body.clientHeight - 86) + 'px'
    },
    initEditor () {
      // 初始化代码编辑器
      let mime = 'text/javascript'
      let theme = 'solarized light' // 设置主题，不设置的会使用默认主题
      let editor = CodeMirror.fromTextArea(this.$refs.mycode, {
        mode: mime, // 选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
        lineNumbers: true, // 显示行号
        lineWrapping: true, // 代码折叠
        indentWithTabs: true,
        smartIndent: true,
        matchBrackets: true,
        theme: theme,
        autofocus: true,
        extraKeys: { Ctrl: 'autocomplete' }, // 自定义快捷键
        hintOptions: {
          // 自定义提示选项
        }
      })
      // 代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
      editor.on('cursorActivity', function () {
        // editor.showHint();
      })
      if (!this.editor) {
        this.editor = editor
      }
    },
    genClass () {
      let codeGenerator = new CodeGenerator(this.getCodeConfig, this.getCurrentTable)
      let file = codeGenerator.genClass()
      this.code = file.code
      this.fileType = file.fileType
      this.fileName = file.fileName
      this.editor.setOption('mode', 'text/javascript')
      this.code = beautifyJs(this.code, jdFormatConfig)
      this.editor.setValue(this.code)

      // 开始生成类代码
    },
    genColumn () {
      let codeGenerator = new CodeGenerator(this.getCodeConfig, this.getCurrentTable)
      let file = codeGenerator.genColumn()
      this.code = file.code
      this.fileType = file.fileType
      this.fileName = file.fileName
      this.editor.setOption('mode', 'text/javascript')
      this.code = beautifyJs(this.code, jdFormatConfig)
      this.editor.setValue(this.code)
    },
    genRule () {
      let codeGenerator = new CodeGenerator(this.getCodeConfig, this.getCurrentTable)
      let file = codeGenerator.genRule()
      this.code = file.code
      this.fileType = file.fileType
      this.fileName = file.fileName
      this.editor.setOption('mode', 'text/javascript')
      this.code = beautifyJs(this.code, jdFormatConfig)
      this.editor.setValue(this.code)
    },
    genForm (formConfig) {
      let codeGenerator = new CodeGenerator(this.getCodeConfig, this.getCurrentTable)
      let file = codeGenerator.genForm(formConfig)
      this.code = file.code
      this.fileType = file.fileType
      this.fileName = file.fileName
      // TODO 需要添加编辑器对vue的支持
      this.editor.setOption('mode', 'text/x-vue')
      // this.code = beautify_js(this.code, jdFormatConfig)
      this.editor.setValue(this.code)
    },
    genJavaClass (formConfig) {
      let codeGenerator = new CodeGenerator(this.getCodeConfig, this.getCurrentTable)
      let file = codeGenerator.genJavaClass(formConfig)
      this.code = file.code
      this.fileType = file.fileType
      this.fileName = file.fileName
      // TODO 需要添加编辑器对vue的支持
      this.editor.setOption('mode', 'text/x-java')
      // this.code = beautify_js(this.code, jdFormatConfig)
      this.editor.setValue(this.code)
    },
    genSearchSql (formConfig) {
      let codeGenerator = new CodeGenerator(this.getCodeConfig, this.getCurrentTable)
      let file = codeGenerator.genSearchSql(formConfig)
      this.code = file.code
      this.fileType = file.fileType
      this.fileName = file.fileName
      // TODO 需要添加编辑器对vue的支持
      this.editor.setOption('mode', 'text/x-sql')
      // this.code = beautify_js(this.code, jdFormatConfig)
      this.editor.setValue(this.code)
    },
    genGetSql (getSqlConfig) {
      let codeGenerator = new CodeGenerator(this.getCodeConfig, this.getCurrentTable)
      let file = codeGenerator.genGetSql(getSqlConfig)
      this.code = file.code
      this.fileType = file.fileType
      this.fileName = file.fileName
      // TODO 需要添加编辑器对vue的支持
      this.editor.setOption('mode', 'text/x-sql')
      // this.code = beautify_js(this.code, jdFormatConfig)
      this.editor.setValue(this.code)
    },
    genSaveSql (formConfig) {
      let codeGenerator = new CodeGenerator(this.getCodeConfig, this.getCurrentTable)
      let file = codeGenerator.genSaveSql(formConfig)
      this.code = file.code
      this.fileType = file.fileType
      this.fileName = file.fileName
      // TODO 需要添加编辑器对vue的支持
      this.editor.setOption('mode', 'text/x-sql')
      // this.code = beautify_js(this.code, jdFormatConfig)
      this.editor.setValue(this.code)
    },
    handleCopy () {
      clipboard.writeText(this.code)
      this.$Message.info('复制成功')
    },
    handleExport () {
      let file = {
        code: this.code,
        fileType: this.fileType,
        fileName: this.fileName
      }
      ipcRenderer.send('code-export', file)
    },
    // handlePreview () {
    //   this.$router.push({
    //     name: 'form-preview'
    //   })
    // }
    handlePreview () {
      let codeGenerator = new CodeGenerator(this.getCodeConfig, this.getCurrentTable)
      let form = Vue.compile(codeGenerator.genFormPreview().code)
      this.$Modal.info({
        title: '表单页预览',
        render: (h) => {
          return h(form)
        }
      })
    }
  }
}
</script>

<style lang="less">
.editor {
  min-height: 100%;
}
</style>
