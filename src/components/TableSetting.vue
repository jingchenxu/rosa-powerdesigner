<template>
  <div class="table-setting">
    <!-- <div class="action-container">
      <Button type="primary">添加</Button>
    </div> -->
    <Table :columns="columns1" :data="data1" :height="400"></Table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import getColumns from './columns/tableSettingColumns'
import { defaultCoreCipherList } from 'constants'

export default {
  name: 'TableSetting',
  computed: {
    ...mapGetters(['getCurrentTable'])
  },
  watch: {
    getCurrentTable: {
      handler (table) {
        // 需要对数据进行处理 生成代码生成所需的数组
        if (table && table.columns) {
          this.data1 = table.columns.map(column => {
            column['_checked'] = true
            column.datatype = column.datatype.split('(')[0]
            column.isclass = true
            column.iscolumn = true
            column.isrule = true
            column.isform = true
            column.componentType = 'Input'
            let selectKeys = ['type', 'status']
            switch (column.datatype) {
              case 'varchar':
                column.componentType = 'Input'
                if (column.columnid.toLowerCase().indexOf('type') > -1 || column.columnid.toLowerCase().indexOf('status') > -1) {
                  column.componentType = 'Select'
                }
                break
              case 'nvarchar':
                column.componentType = 'Input'
                if (column.columnid.toLowerCase().indexOf('type') > -1 || column.columnid.toLowerCase().indexOf('status') > -1) {
                  column.componentType = 'Select'
                }
                break
              case 'bit':
                column.componentType = 'Switch'
                break
              case 'datetime':
                column.componentType = 'DatePicker'
                break
              default:
                // TODO 通過字段的長度判斷
                if (column.length >= 200) {
                  column.componentType = 'Textarea'
                }
            }
            return column
          })
          this.$store.dispatch('UPDATECODECONFIG', this.data1)
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      columns1: getColumns(this),
      data1: []
    }
  },
  mounted () {
    console.dir(this.$refs)
  }
}
</script>

<style lang="less" scoped>
.table-setting {
  .action-container {

  }
}
</style>
