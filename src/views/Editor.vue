<template>
  <div data-step="4" data-intro="查看生成代码是否正确！" class="editor">
    <textarea ref="mycode" v-model="code"></textarea>
  </div>
</template>

<script>
// import 'codemirror/theme/darcula.css'
import 'codemirror/theme/solarized.css'
import 'codemirror/theme/3024-day.css'
import 'codemirror/theme/3024-night.css'
import 'codemirror/theme/abcdef.css'
import 'codemirror/theme/ambiance.css'
// import 'codemirror/theme/ayu-dark.css'
// import 'codemirror/theme/ayu-mirage.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/theme/bespin.css'
import 'codemirror/theme/blackboard.css'
import 'codemirror/theme/cobalt.css'
import 'codemirror/theme/colorforth.css'
import 'codemirror/theme/darcula.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/theme/duotone-dark.css'
import 'codemirror/theme/duotone-light.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/theme/elegant.css'
import 'codemirror/theme/erlang-dark.css'
import 'codemirror/theme/gruvbox-dark.css'
import 'codemirror/theme/hopscotch.css'
import 'codemirror/theme/icecoder.css'
import 'codemirror/theme/idea.css'
import 'codemirror/theme/isotope.css'
import 'codemirror/theme/lesser-dark.css'
import 'codemirror/theme/liquibyte.css'
import 'codemirror/theme/lucario.css'
import 'codemirror/theme/material.css'
// import 'codemirror/theme/material-darker.css'
// import 'codemirror/theme/material-palenight.css'
// import 'codemirror/theme/material-ocean.css'
import 'codemirror/theme/mbo.css'
import 'codemirror/theme/mdn-like.css'
import 'codemirror/theme/midnight.css'
import 'codemirror/theme/monokai.css'
// import 'codemirror/theme/moxer.css'
import 'codemirror/theme/neat.css'
import 'codemirror/theme/neo.css'
import 'codemirror/theme/night.css'
import 'codemirror/theme/nord.css'
import 'codemirror/theme/oceanic-next.css'
import 'codemirror/theme/panda-syntax.css'
import 'codemirror/theme/paraiso-dark.css'
import 'codemirror/theme/paraiso-light.css'
import 'codemirror/theme/pastel-on-dark.css'
import 'codemirror/theme/railscasts.css'
import 'codemirror/theme/rubyblue.css'
import 'codemirror/theme/seti.css'
import 'codemirror/theme/shadowfox.css'
// import 'codemirror/theme/solarized dark.css'
// import 'codemirror/theme/solarized light.css'
import 'codemirror/theme/the-matrix.css'
import 'codemirror/theme/tomorrow-night-bright.css'
import 'codemirror/theme/tomorrow-night-eighties.css'
import 'codemirror/theme/ttcn.css'
import 'codemirror/theme/twilight.css'
import 'codemirror/theme/vibrant-ink.css'
import 'codemirror/theme/xq-dark.css'
import 'codemirror/theme/xq-light.css'
import 'codemirror/theme/yeti.css'
import 'codemirror/theme/yonce.css'
import 'codemirror/theme/zenburn.css'

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
    ...mapGetters(['getCodeConfig', 'getCurrentTable', 'getAppConfig'])
  },
  watch: {
    'getAppConfig.editorTheme': {
      handler (editorTheme) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.editor.setOption('theme', editorTheme)
          }, 1000)
        })
      },
      immediate: true
    }
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
      let theme = this.getAppConfig.editorTheme ? this.getAppConfig.editorTheme : 'solarized light' // 设置主题，不设置的会使用默认主题
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
