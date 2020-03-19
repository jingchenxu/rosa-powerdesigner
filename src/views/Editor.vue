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

import Vue from 'vue'
const beautifyJs = require('js-beautify').js_beautify

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
    /**
     * 编辑器自适应
     */
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
    setCode (code, editorType) {
      this.editor.setOption('mode', editorType)
      this.editor.setValue(code)
    }
  }
}
</script>

<style lang="less">
.editor {
  min-height: 100%;
}

    .CodeMirror {
      box-shadow: none !important;
    }
</style>
