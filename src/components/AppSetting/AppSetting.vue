<template>
  <Tabs type="card">
    <TabPane label="基础设置">
      <base-setting></base-setting>
    </TabPane>
    <TabPane label="快捷键">标签二的内容</TabPane>
    <TabPane label="关于">
      <about></about>
    </TabPane>
  </Tabs>
</template>

<script>
import BaseSetting from './BaseSetting.vue'
import About from './About'
const name = 'AppSetting'

export default {
  name,
  components: {
    BaseSetting,
    About
  }
}
</script>
