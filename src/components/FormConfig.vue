<template>
  <Form :model="form" :label-width="100">
    <Row>
      <Col span="12">
        <FormItem label="是否生成script">
          <Checkbox v-model="form.script"></Checkbox>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="是否生成style">
          <Checkbox v-model="form.style"></Checkbox>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="是否表单校验">
          <Checkbox v-model="form.formCheck"></Checkbox>
        </FormItem>
      </Col>
      <Col>
        <FormItem label="label长度">
          <InputNumber :max="200" :min="80" v-model="form.labelWidth"></InputNumber>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script>
export default {
  name: 'FormConfig',
  data () {
    return {
      form: {
        script: false,
        style: false,
        formCheck: true,
        labelWidth: 120
      }
    }
  }
}
</script>
