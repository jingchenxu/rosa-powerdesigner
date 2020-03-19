<template>
  <div>
    <Form ref="formInline" label-position="left" :model="searchParams" :label-width="60" inline>
      <FormItem label="模板名称" prop="templatename">
        <Input clearable type="text" v-model="searchParams.templatename" placeholder="请输入模板名称">
        </Input>
      </FormItem>
      <FormItem label="模板简介" prop="bref">
        <Input clearable type="text" v-model="searchParams.bref" placeholder="请输入模板简介">
        </Input>
      </FormItem>
      <FormItem :label-width="0">
        <Button icon="ios-search" :loading="loading" type="primary" @click="onSearch">查询</Button>
      </FormItem>
    </Form>
    <Table :columns="columns" :loading="loading" size="small" :data="list"></Table>
    <Divider />
    <Page @on-change="pageChange" :page-size="10" :total="total" />
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import { mapGetters } from 'vuex'
const name = 'OnlineTemplate'
const { ipcRenderer } = window.require('electron')

export default {
  name,
  data () {
    return {
      list: [],
      searchParams: {},
      pagenumber: 1,
      total: 0,
      loading: false,
      columns: [
        {
          title: '模板名称',
          key: 'templatename'
        },
        {
          title: '模板简介',
          key: 'bref'
        },
        {
          title: '代码语言',
          key: 'codelanguagename'
        },
        {
          title: '文件后缀',
          key: 'fileextension'
        },
        {
          title: '模板分类',
          key: 'templatetypename'
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            let hasDownload = this.getTemplateList.map(template => template.templateid).includes(params.row.templateid)
            let btnText = hasDownload ? '已下载' : '下载'

            return h('div', [
              h(
                'i-button',
                {
                  props: {
                    type: 'primary',
                    disabled: hasDownload
                  },
                  on: {
                    click: () => {
                      this.handleDownload(params.row)
                    }
                  }
                },
                btnText
              )
            ])
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getCurrentTable', 'getTemplateList', 'getActiveTemplate', 'getCurrentUser', 'getToken'])
  },
  methods: {
    onSearch () {
      this.loading = true
      let searchParams = _.cloneDeep(this.searchParams)
      Object.assign(searchParams, {
        pagenumber: this.pagenumber
      })
      axios
        .get(`${window.process.env.ELECTRON_APP_BASE_API}search_rosa_template`, {
          params: searchParams
        })
        .then(res => {
          let result = res.data
          this.list = result.list
          this.total = result.total
        })
        .finally(() => {
          this.loading = false
        })
    },
    pageChange (pagenumber) {
      this.pagenumber = pagenumber
      this.onSearch()
    },
    handleDownload (row) {
      axios.post(`${window.process.env.ELECTRON_APP_BASE_API}download_rosa_template`, row, {
        headers: {
          token: this.getToken
        }
      }).then(res => {
        let result = res.data
        if (result.success) {
          this.$Message.success(result.msg)
          let getTemplateList = _.cloneDeep(this.getTemplateList)
          getTemplateList.push(result.data)
          this.$store.dispatch('UPDATETEMPLATELIST', getTemplateList)
          ipcRenderer.send('updateTemplateList', getTemplateList)
        } else {
          this.$Message.error(result.msg)
        }
      })
    }
  },
  mounted () {
    this.onSearch()
  }
}
</script>

<style>
</style>
