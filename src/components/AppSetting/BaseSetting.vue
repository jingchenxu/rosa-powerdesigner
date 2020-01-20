<template>
  <Form ref="appConfig" :model="appConfig" :rules="appRule" :label-width="80">
    <FormItem label="Name" prop="name">
      <Input v-model="appConfig.name" placeholder="Enter your name"></Input>
    </FormItem>
    <FormItem label="E-mail" prop="mail">
      <Input v-model="appConfig.mail" placeholder="Enter your e-mail"></Input>
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
