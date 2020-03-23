<template>
  <Form ref="appConfig" :model="appConfig" :rules="appRule" :label-width="100">
    <FormItem label="编辑器主题" prop="editorTheme">
      <Select @on-change="editorThemeChange" value="getEditorTheme">
        <Option v-for="editorTheme in editorThemes" :value="editorTheme" :key="editorTheme">{{ editorTheme }}</Option>
      </Select>
    </FormItem>
  </Form>
</template>

<script>
import editorThemes from './editorThemes'
import { mapGetters } from 'vuex'
const { ipcRenderer } = window.require('electron')

const name = 'BaseSetting'

export default {
  name,
  computed: {
    ...mapGetters(['getAppConfig', 'getEditorTheme'])
  },
  data () {
    return {
      appConfig: {
        editorTheme: '3024-day'
      },
      appRule: {},
      editorThemes
    }
  },
  methods: {
    editorThemeChange (editorTheme) {
      console.log(editorTheme)
      this.$store.dispatch('UPDATEEDITORTHEME', editorTheme)
      const appConfig = this.getAppConfig
      appConfig.editorTheme = editorTheme
      ipcRenderer.send('updateAppConfig', appConfig)
    },
    handleSubmit () {},
    handleReset () {}
  }
}
</script>
