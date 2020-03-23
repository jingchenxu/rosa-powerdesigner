<template>
  <Tabs type="card">
    <TabPane label="基础设置">
      <base-setting></base-setting>
    </TabPane>
    <TabPane label="问题反馈">
      <issue-report></issue-report>
    </TabPane>
    <TabPane label="快捷键设置">标签二的内容</TabPane>
    <TabPane label="关于">
      <about></about>
    </TabPane>
  </Tabs>
</template>

<script>
import BaseSetting from './BaseSetting.vue'
import About from './About.vue'
import IssueReport from './IssueReport.vue'

const name = 'AppSetting'

export default {
  name,
  components: {
    BaseSetting,
    About,
    IssueReport
  }
}
</script>
