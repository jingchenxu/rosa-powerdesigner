<template>
  <div class="table-setting">
    <Table :columns="column" size="small" :data="getCurrentTable.columns" :height="400"></Table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TableSetting',
  computed: {
    ...mapGetters(['getCurrentTable'])
  },
  data () {
    return {
      column: [
        {
          title: '字段编号',
          key: 'columnid'
        },
        {
          title: '字段名称',
          key: 'columnname'
        },
        {
          title: '是否为主键',
          key: 'ismainkey'
        },
        {
          title: '数据类型',
          key: 'datatype'
        },
        {
          title: '字段长度',
          key: 'length'
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('i-button', {
              props: {
                type: 'primary'
              }
            }, '编辑')
          }
        }
      ]
    }
  }
}
</script>
