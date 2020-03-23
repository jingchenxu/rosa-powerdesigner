<template>
  <Card dis-hover :bordered="false">
    <div style="text-align:center">
      <img src="../../../public/rosa.png" />
      <h3>关于</h3>
      <p>如果是的项目使用<a @click="linkToIntroduction" href="https://baike.baidu.com/item/power%20designer/2482290?fromtitle=PowerDesigner&fromid=5408320&fr=aladdin">powerdesigner</a>设计表结构，那么可以使用此软件根据PDM生成一些项目中的基础代码。</p>
    </div>
  </Card>
</template>

<script>
const shell = require('electron').shell

const name = 'About'

export default {
  name,
  methods: {
    linkToIntroduction (e) {
      e.preventDefault()
      shell.openExternal(e.target.href)
    }
  }
}
</script>
