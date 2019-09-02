<template>
  <div>
    <Menu width="auto" @on-select="handleSelect" @on-open-change="handleOpenChange" theme="dark" active-name="1-2" :open-names="['1']">
      <Submenu :key="dbindex" v-for="(db, dbindex) of menu" :name="db.code">
        <template slot="title">
          <Icon type="ios-cog" />
          {{db.name}}
        </template>
        <MenuItem v-show="table.show" :key="tableindex" v-for="(table, tableindex) of db.tables" :name="table.tablecode">{{table.tablecode}}</MenuItem>
      </Submenu>
    </Menu>
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
  methods: {
    handleSelect (name) {
      console.log(`${name}表单被点击`)
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
    }
  }
}
</script>

<style lang="less">
.ivu-menu-item {
}
</style>
