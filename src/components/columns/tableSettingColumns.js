const componentType = ['Input', 'Select', 'Switch', 'Radio', 'Checkbox', 'DatePicker', 'Textarea']

export default function (vm) {
  let columns = [{
    type: 'selection',
    width: 60,
    align: 'center'
  }, {
    title: '字段名称',
    minWidth: 120,
    render: (h, params) => {
      let create = vm.$createElement
      return create('span', `${params.row.columnname}(${params.row.columnid})(${params.row.length})`)
    },
    key: 'columnname'
  },
  // {
  //   title: '字段类型',
  //   width: 90,
  //   key: 'datatype'
  // },
  // {
  //   title: '是否为主键',
  //   width: 100,
  //   key: 'ismainkey'
  // },
  // {
  //   title: '字段长度',
  //   width: 90,
  //   key: 'length'
  // },
  // {
  //   title: '是否为空',
  //   width: 90,
  //   key: 'mandatory'
  // },
  {
    title: '是否生成类',
    width: 100,
    render: (h, params) => {
      let create = vm.$createElement
      return create('Checkbox', {
        ref: `${params.index}-isclass`,
        props: {
          value: params.row.isclass
        },
        on: {
          input (value) {
            vm.data1[params.index].isclass = value
          }
        }
      })
    },
    key: 'isclass'
  },
  {
    title: '是否生成表头',
    width: 108,
    render: (h, params) => {
      let create = vm.$createElement
      return create('Checkbox', {
        ref: `${params.index}-iscolumn`,
        props: {
          value: params.row.iscolumn
        },
        on: {
          input (value) {
            vm.data1[params.index].iscolumn = value
          }
        }
      })
    },
    key: 'iscolumn'
  },
  {
    title: '是否生成规则',
    width: 108,
    render: (h, params) => {
      let create = vm.$createElement
      return create('Checkbox', {
        ref: `${params.index}-isrule`,
        props: {
          value: params.row.isrule
        },
        on: {
          input (value) {
            vm.data1[params.index].isrule = value
          }
        }
      })
    },
    key: 'isrule'
  },
  {
    title: '是否生成表单',
    width: 108,
    render: (h, params) => {
      let create = vm.$createElement
      return create('Checkbox', {
        ref: `${params.index}-isform`,
        props: {
          value: params.row.isform
        },
        on: {
          input (value) {
            vm.data1[params.index].isform = value
          }
        }
      })
    },
    key: 'isform'
  },
  {
    title: '组件类型',
    width: 112,
    render: (h, params) => {
      let create = vm.$createElement
      return create('Select', {
        ref: `${params.index}-componentType`,
        props: {
          value: params.row.componentType
        },
        on: {
          input (value) {
            vm.data1[params.index].componentType = value
          }
        }
      }, componentType.map((_componentType, index) => create('Option', {
        props: {
          value: _componentType,
          label: _componentType,
          key: index
        }
      })))
    }
  }
  ]
  return columns
}
