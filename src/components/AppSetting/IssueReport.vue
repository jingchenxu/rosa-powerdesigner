<template>
  <Form ref="issueReport" :model="issueForm" :rules="issueRule" :label-width="80">
    <FormItem label="问题标题" prop="title">
      <Input v-model="issueForm.title" placeholder="请输入问题标题"></Input>
    </FormItem>
    <FormItem label="问题描述" prop="body">
      <Input v-model="issueForm.body" type="textarea" :autosize="{ minRows: 8, maxRows: 10 }" placeholder="请输入问题描述"></Input>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit('issueReport')">Submit</Button>
      <Button @click="handleReset('issueReport')" style="margin-left: 8px">Reset</Button>
    </FormItem>
  </Form>
</template>

<script>
const shell = require('electron').shell

const name = 'IssueReport'

export default {
  name,
  data () {
    return {
      issueForm: {
        title: '',
        body: ''
      },
      issueRule: {}
    }
  },
  methods: {
    handleSubmit (ref) {
      shell.openExternal(`https://github.com/jingchenxu/rosa-powerdesigner/issues/new?title=${this.issueForm.title}4&body=${this.issueForm.body}`)
    },
    handleReset (ref) {
      this.$Message.info('handleReset')
    }
  }
}
</script>
