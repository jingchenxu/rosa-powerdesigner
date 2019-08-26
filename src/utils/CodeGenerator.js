class CodeGenerator {
  constructor (codeConfig = [], table = {}) {
    this.codeConfig = codeConfig
    this.table = table
  }

  genClass () {
    let className = ''
    this.table.tablecode.split('_').forEach((element, index) => {
      if (index > 0) {
        className = className + element
      }
    })
    let code = `class ${className} {
  constructor () {`
    for (let column of this.codeConfig) {
      if (column.isclass) {
        // 生成默认值
        let defaultValue = '\'\''
        switch (column.datatype) {
          case 'bit':
            defaultValue = false
            break
          case 'smallint':
            defaultValue = 0
            break
          case 'int':
            defaultValue = 0
            break
          case 'datetime':
            defaultValue = 'new Date()'
            break
          default:
            defaultValue = '\'\''
        }
        code = code + `\n   // ${column.columnname} ${column.datatype}`
        code = code + `\n   this.${column.columnid.toLowerCase()}=${defaultValue};`
      }
    }
    code = code + `\n  }
}`
    let file = {
      code,
      fileName: className,
      fileType: 'js'
    }
    return file
  }

  genColumn () {
    let code = ''
    let codeStart = `export default function (vm) {let columns = [`
    let codeEnd = `];return columns;}`
    code = code + codeStart
    for (let column of this.codeConfig) {
      if (column.iscolumn) {
        code = code + `        {
          title: '${column.columnname}',
          width: 120,
          key: '${column.columnid.toLowerCase()}'
      },`
      }
    }
    code = code + codeEnd
    let file = {
      code,
      fileName: 'columns',
      fileType: 'js'
    }
    return file
  }

  genRule () {
    let code = ''
    let ruleName = ''
    this.table.tablecode.split('_').forEach((element, index) => {
      if (index > 0) {
        ruleName = ruleName + element.toLowerCase()
      }
    })
    ruleName = `${ruleName}rules`
    let codestart = `const ${ruleName} = `
    let codeend = `;export default ${ruleName};`
    let rules = {}
    for (let column of this.codeConfig) {
      if (column.isrule) {
        let columnRules = []
        switch (column.componentType) {
          case 'Input':
            let inputRule = {
              required: true,
              message: `${column.columnname}不能为空`,
              trigger: 'blur'
            }
            columnRules.push(inputRule)
            // TODO 针对数字进行校验
            let inputNumberRule = {
              type: 'number',
              message: '请输入数字',
              trigger: 'blur',
              transform: `(value) => {\n` +
              `  return Number(value)\n` +
              `}\n`
            }
            if (column.datatype === 'int' || column.datatype === 'smallint') {
              columnRules.push(inputNumberRule)
            }
            break
          case 'Select':
            let selectRule = {
              required: true,
              message: `请选择${column.columnname}`,
              trigger: 'change'
            }
            columnRules.push(selectRule)
            break
          case 'DatePicker':
            let datepickerRule = {
              required: true,
              message: `请选择${column.columnname}`,
              trigger: 'change'
            }
            columnRules.push(datepickerRule)
            break
          default:
            columnRules = []
        }
        // TODO 根据组件类型进行判断
        rules[column.columnid.toLowerCase()] = columnRules
      }
    }
    code = codestart + JSON.stringify(rules) + codeend
    let file = {
      code,
      fileName: ruleName,
      fileType: 'js'
    }
    return file
  }

  genForm (formConfig) {
    let code = ''
    let codestart = '<template>\n' +
                    `  <Form :ref="formRef" :model="form" :rules="ruleValidate" :label-width="${formConfig.labelWidth}" class="formDetail">\n` +
                    '    <Row>\n'
    let codeend = '    </Row>\n' +
                  '  </Form>\n' +
                  '</template>'
    let formitems = ''
    for (let column of this.codeConfig) {
      if (column.isform) {
        switch (column.componentType) {
          case 'Input':
            formitems = formitems +
            '      <Col span="8">\n' +
            `      <FormItem label="${column.columnname}" prop="${column.columnid.toLowerCase()}">\n` +
            `        <Input v-model="form.${column.columnid.toLowerCase()}" :disabled="canedit" placeholder="请输入${column.columnname}"></Input>\n` +
            '      </FormItem>\n' +
            '      </Col>\n'
            break
          case 'Select':
            formitems = formitems +
            `      <Col span="8">\n` +
            `      <FormItem label="${column.columnname}" prop="${column.columnid.toLowerCase()}">\n` +
            `        <Select placeholder="请选择${column.columnname}" v-model="form.${column.columnid.toLowerCase()}" :disabled="canedit">\n` +
            `          <Option v-for="(item, index) in getParams.${column.columnid.toLowerCase()}" :key="index" :value="item.id">\n` +
            `            {{ item.name }}\n` +
            `          </Option>\n` +
            `        </Select>\n` +
            `      </FormItem>\n` +
            `      </Col>\n`
            break
          case 'Switch':
            formitems = formitems +
            '      <Col span="4">\n' +
            `      <FormItem label="${column.columnname}">\n` +
            `        <i-switch v-model="form.${column.columnid.toLowerCase()}" size="large" :disabled="canedit">\n` +
            `          <span slot="open">是</span>\n` +
            `          <span slot="close">否</span>\n` +
            `        </i-switch>\n` +
            '      </FormItem>\n' +
            '      </Col>\n'
            break
          case 'DatePicker':
            formitems = formitems +
            `      <Col span="8">\n` +
            `        <FormItem label="${column.columnname}" prop="${column.columnid.toLowerCase()}">\n` +
            `          <DatePicker type="date" :disabled="canedit" v-model="form.${column.columnid.toLowerCase()}" placeholder="请选择${column.columnname}"></DatePicker>\n` +
            `        </FormItem>\n` +
            `      </Col>\n`
            break
          case 'Textarea':
            formitems = formitems +
            `      <Col span="24">\n` +
            `        <FormItem label="${column.columnname}" prop="${column.columnid.toLowerCase()}">\n` +
            `          <Input v-model="form.${column.columnid.toLowerCase()}" :maxlength="${column.length}" :disabled="canedit" :rows="3" type="textarea" placeholder="请输入${column.columnname}" />\n` +
            `        </FormItem>\n` +
            `      </Col>\n`
            break
          default:
            console.log('匹配到未知的数据类型')
        }
      }
    }
    code = codestart + formitems + codeend
    if (formConfig.script) {
      code = code +
      `\n` +
      `<script>\n` +
      `export default {\n` +
      `\n` +
      `}\n` +
      `</script>\n`
    }
    if (formConfig.style) {
      code = code +
      `\n` +
      `<style scoped lang="less">\n` +
      `</style>\n`
    }
    let file = {
      code,
      fileName: 'form',
      fileType: 'vue'
    }
    return file
  }

  genFormPreview () {
    let code = ''
    let codestart = '  <Form :label-width="140" class="formDetail">\n' +
    '    <Row>\n'
    let codeend = '    </Row>\n' +
    '  </Form>\n'
    let formitems = ''
    for (let column of this.codeConfig) {
      if (column.isform) {
        switch (column.componentType) {
          case 'Input':
            formitems = formitems + '      <Col span="8">\n' +
            `      <FormItem label="${column.columnname}" prop="${column.columnid.toLowerCase()}">\n` +
            `        <Input placeholder="请输入${column.columnname}"></Input>\n` +
            '      </FormItem>\n' +
            '      </Col>\n'
            break
          case 'Select':
            break
          case 'Switch':
            break
          default:
            console.log('匹配到未知的数据类型')
        }
      }
    }
    code = codestart + formitems + codeend
    let file = {
      code,
      fileName: 'form',
      fileType: 'vue'
    }
    return file
  }
}

export default CodeGenerator
