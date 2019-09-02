<template>
  <Form :model="form" :label-width="120">
    <Row>
      <Col span="24">
        <FormItem label="请选择主键">
          <Select v-model="form.mainKey" filterable>
            <Option v-for="item in currentTable.columns" :value="item.columnid" :key="item.columnid">{{ item.columnname }}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script>
export default {
  name: 'GetSqlConfig',
  props: {
    currentTable: {
      type: Object,
      default: () => {
        return {
          columns: []
        }
      }
    }
  },
  data () {
    console.dir(this)
    return {

      form: {
        mainKey: this.currentTable.columns[0].columnid
      }
    }
  }
}
</script>