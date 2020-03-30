<template>
  <div class="table-setting">
    <Alert type="warning">当前修改仅本次代码生成有效，并不会永久保存修改！</Alert>
    <Table :columns="column" stripe size="small" :data="getCurrentTable.columns" :height="400"></Table>
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
          title: '序号',
          width: 60,
          type: 'index'
        },
        {
          title: '字段编号',
          key: 'columnid',
          render: (h, params) => {
            const { index, row } = { ...params }
            let input = h('i-input', {
              props: {
                value: row.columnid
              },
              on: {
                'on-change': (e) => {
                  let currentTable = this.getCurrentTable
                  currentTable.columns[index].columnid = e.target.value
                  this.$store.dispatch('UPDATECURRENTTABLE', currentTable)
                }
              }
            })
            let text = h('span', row.columnid)
            return row.canedit ? input : text
          }
        },
        {
          title: '字段名称',
          key: 'columnname',
          render: (h, params) => {
            const { index, row } = { ...params }
            let input = h('i-input', {
              props: {
                value: row.columnname
              },
              on: {
                'on-change': (e) => {
                  let currentTable = this.getCurrentTable
                  currentTable.columns[index].columnname = e.target.value
                  this.$store.dispatch('UPDATECURRENTTABLE', currentTable)
                }
              }
            })
            let text = h('span', row.columnname)
            return row.canedit ? input : text
          }
        },
        {
          title: '是否为主键',
          key: 'ismainkey',
          render: (h, params) => {
            const { index, row } = { ...params }
            let input = h('i-switch', {
              props: {
                value: row.ismainkey,
                disabled: !row.canedit
              },
              on: {
                'on-change': (e) => {
                  let currentTable = this.getCurrentTable
                  currentTable.columns[index].ismainkey = e
                  this.$store.dispatch('UPDATECURRENTTABLE', currentTable)
                }
              }
            })
            return input
          }
        },
        {
          title: '数据类型',
          key: 'datatype',
          render: (h, params) => {
            const { index, row } = { ...params }
            let input = h('i-input', {
              props: {
                value: row.datatype
              },
              on: {
                'on-change': (e) => {
                  let currentTable = this.getCurrentTable
                  currentTable.columns[index].datatype = e.target.value
                  this.$store.dispatch('UPDATECURRENTTABLE', currentTable)
                }
              }
            })
            let text = h('span', row.datatype)
            return row.canedit ? input : text
          }
        },
        {
          title: '字段长度',
          key: 'length',
          render: (h, params) => {
            const { index, row } = { ...params }
            let input = h('i-input', {
              props: {
                value: row.length
              },
              on: {
                'on-change': (e) => {
                  let currentTable = this.getCurrentTable
                  currentTable.columns[index].length = e.target.value
                  this.$store.dispatch('UPDATECURRENTTABLE', currentTable)
                }
              }
            })
            let text = h('span', row.length)
            return row.canedit ? input : text
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            const { index, row } = { ...params }
            const editButton = h('i-button', {
              props: {
                type: 'primary'
              },
              on: {
                click: () => {
                  let currentTable = this.getCurrentTable
                  currentTable.columns[index].canedit = true
                  this.$store.dispatch('UPDATECURRENTTABLE', currentTable)
                }
              }
            }, '编辑')
            const saveButton = h('i-button', {
              props: {
                type: 'primary'
              },
              on: {
                click: () => {
                  let currentTable = this.getCurrentTable
                  currentTable.columns[index].canedit = false
                  this.$store.dispatch('UPDATECURRENTTABLE', currentTable)
                }
              }
            }, '保存')
            const actionButton = row.canedit ? saveButton : editButton
            return actionButton
          }
        }
      ]
    }
  }
}
</script>
