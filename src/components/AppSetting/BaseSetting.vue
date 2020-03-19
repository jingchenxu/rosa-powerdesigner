<template>
  <Form ref="appConfig" :model="appConfig" :rules="appRule" :label-width="80">
    <FormItem label="Name" prop="name">
      <Input v-model="appConfig.name" placeholder="Enter your name"></Input>
    </FormItem>
                  <FormItem label="问题标题" prop="bref">
                    <Input v-model="appConfig.bref" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" placeholder="请输入模板简介"></Input>
                  </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit('appConfig')">Submit</Button>
      <Button @click="handleReset('appConfig')" style="margin-left: 8px">Reset</Button>
    </FormItem>
  </Form>
</template>

<script>
const name = 'BaseSetting'

export default {
  name,
  data () {
    return {
      appConfig: {},
      appRule: {}
    }
  },
  methods: {
    handleSubmit () {},
    handleReset () {}
  }
}
</script>
