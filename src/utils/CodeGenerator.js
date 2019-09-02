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

  genJavaClass () {
    // TODO 需要制定package的位置
    let className = ''
    this.table.tablecode.split('_').forEach((element, index) => {
      if (index > 0) {
        className = className + element
      }
    })
    let code = ''
    let codeStart = `public class ${className} implements BaseBean {\n\r`
    let codeEnd = '\n}'
    let codeItems = ''
    // let codeRules = ''
    let codeDebug = ''
    let debugString = ''
    let classInit = `    @Override\n    public void OnInit() {\n`
    let classGetAndSet = ''
    for (let column of this.codeConfig) {
      let _columnid = column.columnid.toLowerCase()
      debugString = `${debugString}"${column.columnname}:${_columnid}", `
      switch (column.datatype) {
        case 'varchar':
          codeItems = `${codeItems}    // ${column.columnname}\n    private String ${_columnid};\n`
          classInit = `${classInit}        this.${_columnid} = "";\n`
          classGetAndSet = `${classGetAndSet}    public String get${_columnid.charAt(0).toUpperCase()}${_columnid.slice(1)}() {\n        return ${_columnid};\n    }\n\r`
          classGetAndSet = `${classGetAndSet}    public void set${_columnid.charAt(0).toUpperCase()}${_columnid.slice(1)}(String ${_columnid}) {\n        this.${_columnid} = ${_columnid};\n    }\n\r`
          break
        case 'nvarchar':
          codeItems = `${codeItems}    // ${column.columnname}\n    private String ${_columnid};\n`
          classInit = `${classInit}        this.${_columnid} = "";\n`
          classGetAndSet = `${classGetAndSet}    public String get${_columnid.charAt(0).toUpperCase()}${_columnid.slice(1)}() {\n        return ${_columnid};\n    }\n\r`
          classGetAndSet = `${classGetAndSet}    public void set${_columnid.charAt(0).toUpperCase()}${_columnid.slice(1)}(String ${_columnid}) {\n        this.${_columnid} = ${_columnid};\n    }\n\r`
          break
        case 'smallint':
          codeItems = `${codeItems}    // ${column.columnname}\n    private int ${_columnid};\n`
          classInit = `${classInit}        this.${_columnid} = 0;\n`
          classGetAndSet = `${classGetAndSet}    public int get${_columnid.charAt(0).toUpperCase()}${_columnid.slice(1)}() {\n        return ${_columnid};\n    }\n\r`
          classGetAndSet = `${classGetAndSet}    public void set${_columnid.charAt(0).toUpperCase()}${_columnid.slice(1)}(int ${_columnid}) {\n        this.${_columnid} = ${_columnid};\n    }\n\r`
          break
        case 'int':
          codeItems = `${codeItems}    // ${column.columnname}\n    private int ${_columnid};\n`
          classInit = `${classInit}        this.${_columnid} = 0;\n`
          classGetAndSet = `${classGetAndSet}    public int get${_columnid.charAt(0).toUpperCase()}${_columnid.slice(1)}() {\n        return ${_columnid};\n    }\n\r`
          classGetAndSet = `${classGetAndSet}    public void set${_columnid.charAt(0).toUpperCase()}${_columnid.slice(1)}(int ${_columnid}) {\n        this.${_columnid} = ${_columnid};\n    }\n\r`
          break
        case 'date':
          codeItems = `${codeItems}    // ${column.columnname}\n    private Date ${_columnid};\n`
          classInit = `${classInit}        this.${_columnid} = DateUtils.GetMinDate();\n`
          classGetAndSet = `${classGetAndSet}    public java.util.Date get${_columnid.charAt(0).toUpperCase()}${_columnid.slice(1)}() {\n        return ${_columnid};\n    }\n\r`
          classGetAndSet = `${classGetAndSet}    public void set${_columnid.charAt(0).toUpperCase()}${_columnid.slice(1)}(java.util.Date ${_columnid}) {\n        this.${_columnid} = ${_columnid};\n    }\n\r`
          break
        case 'datetime':
          codeItems = `${codeItems}    // ${column.columnname}\n    private Date ${_columnid};\n`
          classInit = `${classInit}        this.${_columnid} = DateUtils.GetMinDate();\n`
          classGetAndSet = `${classGetAndSet}    public java.util.Date get${_columnid.charAt(0).toUpperCase()}${_columnid.slice(1)}() {\n        return ${_columnid};\n    }\n\r`
          classGetAndSet = `${classGetAndSet}    public void set${_columnid.charAt(0).toUpperCase()}${_columnid.slice(1)}(java.util.Date ${_columnid}) {\n        this.${_columnid} = ${_columnid};\n    }\n\r`
          break
        case 'bit':
          codeItems = `${codeItems}    // ${column.columnname}\n    private boolean ${_columnid};\n`
          classInit = `${classInit}        this.${_columnid} = false;\n`
          classGetAndSet = `${classGetAndSet}    public boolean get${_columnid.charAt(0).toUpperCase()}${_columnid.slice(1)}() {\n        return ${_columnid};\n    }\n\r`
          classGetAndSet = `${classGetAndSet}    public void set${_columnid.charAt(0).toUpperCase()}${_columnid.slice(1)}(boolean ${_columnid}) {\n        this.${_columnid} = ${_columnid};\n    }\n\r`
          break
        default:
          console.log(`${column.datatype}未匹配到合适的数据类型`)
      }
    }
    // 针对deal进行处理
    codeItems = `${codeItems}    \r    @JsonIgnore\n    private DataDeal<${className}> deal;\n\r`
    // 生成构造函数
    codeItems = `${codeItems}    public ${className} {\n       this.OnInit();\n    }\r`
    // TODO 生成表单校验
    // 生成调试信息
    codeDebug = `${codeDebug}    \r    @Override\n    public String OnDebug() {\n        return TranUtils.DebugProperty(this, this.OnProperties());\n    }\n\r`
    codeDebug = `${codeDebug}    @Override\n    public String OnCompare() {\n        return TranUtils.CompareProperty((${className})item, this, this.OnProperties());\n    }\n\r`
    debugString = debugString.substring(0, debugString.length - 2)
    codeDebug = `${codeDebug}    @Override\n    public String[] OnProperties() {\n        return new String[] {${debugString}};\n    }\n\r`
    // TODO 生成exclusiongs
    codeDebug = `${codeDebug}    @Override\n    public String[] OnExclusions() {\n        return new String[] { "deal" };\n    }\n\r`
    // 构造函数调用的初始化函数
    classInit = `${classInit}    }\n\r`
    // 生成setter and getter
    classGetAndSet = `${classGetAndSet}    public DataDeal<${className} getDeal() {\n        if (deal == null)\n            deal = new DataDeal<${className}>();\n        return deal;\n    }\n\r`
    classGetAndSet = `${classGetAndSet}    public void setDeal(DataDeal<${className}> deal) {\n        this.deal = deal;\n    }\n\r`
    code = codeStart + codeItems + codeDebug + classInit + classGetAndSet + codeEnd
    let file = {
      code,
      fileName: className,
      fileType: 'java'
    }
    return file
  }

  genSearchSql () {
    let procedure = ''
    let code = ''
    let tableName = this.table.tablecode.toLowerCase()
    this.table.tablecode.split('_').forEach((element, index) => {
      if (index > 0) {
        procedure = procedure + element
      }
    })
    let countSql = `'select @TOTAL = count(*) from '
    + '${tableName} a '
    + 'where 1=1 '
`
    let searchSql = `'select * from (select a.*, '
    + 'row_number() over (order by a.coid) as RN from '
    + '${tableName} a '
    + 'where 1=1 '

`
    procedure = `P_Search_${procedure}`
    code = `${code}if (exists (select name from sysobjects where (name = N'${procedure}') and (type = 'P')))\n  drop procedure dbo.${procedure}\ngo\n\r`
    code = `${code}create procedure [abo].${procedure}\n(\n  @search varchar(4000) = null,\n  @start int = null,\n  @end int = null,\n  @total int = null out,\n  @getaction varchar(10) = null\n)\nas\n`
    code = `${code}begin\n  if (@start is not null) and (@end is not null)\n  begin\n    declare @sql nvarchar(4000)\n\r    set @sql = ${countSql}\n\r`
    code = `${code}    if (isnull(@search, '') != '')\n     set @sql = @sql + ' and ' +  @search\n\r`
    code = `${code}    exec sp_executesql @sql, N'@TOTAL int out', @total out\n\r`
    code = `${code}    set @sql = ${searchSql}\n\r`
    code = `${code}    if (isnull(@search, '') != '')\n      set @sql = @sql + ' and ' +  @search\n\r`
    code = `${code}    set @sql = @sql + ' ) SearchList where RN between ' + ltrim(str(@start)) + ' and ' + ltrim(str(@end))\n\r`
    code = `${code}    exec(@sql)\n  end\nend\n\rgo`
    let file = {
      code,
      fileName: procedure,
      fileType: 'sql'
    }
    return file
  }

  genGetSql (getSqlConfig) {
    console.dir(getSqlConfig)
    let procedure = ''
    let code = ''
    let tableName = this.table.tablecode.toLowerCase()
    this.table.tablecode.split('_').forEach((element, index) => {
      if (index > 0) {
        procedure = procedure + element
      }
    })
    let mainKey = getSqlConfig.mainKey.toLowerCase()
    let getSql = `select a.* from ${tableName} a where a.${mainKey} = @${mainKey}`
    procedure = `P_Get_${procedure}`
    code = `${code}if (exists (select name from sysobjects where (name = N'${procedure}') and (type = 'P')))\n  drop procedure dbo.${procedure}\ngo\n\r`
    code = `${code}create procedure [abo].${procedure}\n(\n  @${mainKey} varchar(4)\n)\nas\n`
    code = `${code}begin\n   ${getSql}\nend\n\rgo`
    let file = {
      code,
      fileName: procedure,
      fileType: 'sql'
    }
    return file
  }

  genSaveSql () {
    let procedure = ''
    let code = ''
    let codeParams = ''
    let insertSql = ''
    let insertSqlKey = ''
    let insertSqlValue = ''
    let updateSql = ''
    let tableName = this.table.tablecode.toLowerCase()
    this.table.tablecode.split('_').forEach((element, index) => {
      if (index > 0) {
        procedure = procedure + element
      }
    })
    for (let column of this.codeConfig) {
      console.dir(column)
      let _columnid = column.columnid.toLowerCase()
      let length = column.length
      let datatype = column.datatype
      if (length) {
        codeParams = `${codeParams}  @${_columnid} ${datatype}(${length}) = null,\n`
      } else {
        codeParams = `${codeParams}  @${_columnid} ${datatype} = null,\n`
      }
      insertSqlKey = `${insertSqlKey}${_columnid}, `
      insertSqlValue = `${insertSqlValue}@${_columnid}, `
      updateSql = `${updateSql}    ${_columnid} = @${_columnid},\n`
    }
    insertSqlKey = insertSqlKey.substring(0, insertSqlKey.length - 2)
    insertSqlValue = insertSqlValue.substring(0, insertSqlValue.length - 2)
    insertSql = `insert into ${tableName}(${insertSqlKey}) values (${insertSqlValue})`
    updateSql = `update ${tableName} set\n${updateSql}   where coid = @coid\n  end\nend\ngo`
    codeParams = `${codeParams}  @action int\n`
    procedure = `P_Save_${procedure}`
    code = `${code}if (exists (select name from sysobjects where (name = N'${procedure}') and (type = 'P')))\n  drop procedure dbo.${procedure}\ngo\n\r`
    code = `${code}create procedure [dbo].${procedure}\n(\n${codeParams})\nas\nbegin\n  set nocount on\n\r`
    code = `${code}  if @action = 2\n  begin\n    ${insertSql}\n  end`
    code = `${code}  else if @action = 3\n  begin\n   ${updateSql}`
    let file = {
      code,
      fileName: procedure,
      fileType: 'sql'
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
