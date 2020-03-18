<template>
  <div class="table-menu">
    <Tree ref="tree" empty-text="请打开PDM文件" @on-select-change="handleChange" :data="treeDate"></Tree>
  </div>
</template>

<script>
export default {
  name: 'TableMenu',
  props: {
    menu: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    treeDate () {
      return this.menu.map(menu => {
        let temp = {
          title: menu.name,
          expand: true,
          children: [
            {
              title: '表',
              expand: true,
              children: menu.tables.map(table => {
                let _table = {
                  title: table.tablecode,
                  db: menu
                }
                return _table
              })
            }
          ]
        }
        return temp
      })
    }
  },
  methods: {
    handleSelect (name) {
      for (let db of this.menu) {
        for (let table of db.tables) {
          if (table.tablecode === name) {
            this.$store.dispatch('UPDATECURRENTTABLE', table)
          }
        }
      }
    },
    handleOpenChange (names) {
      this.$store.dispatch('UPDATECURRENTDB', names)
    },
    handleChange (array, node) {
      // TODO 这里需要找到父节点
      this.handleSelect(node.title)
      this.$store.dispatch('UPDATECURRENTDB', node.db)
    }
  }
}
</script>

<style lang="less">
.table-menu {
  padding: 0 10px;
}
</style>
