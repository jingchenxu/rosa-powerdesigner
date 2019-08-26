const fs = require('fs')
const parseString = require('xml2js').parseString
const db = require('./DBInfo')

let dbinfo = db.dbinfo
let table = db.table
let column = db.column

function getObjectFromPDM (filePath) {
  let data = fs.readFileSync(filePath)

  parseString(data.toString(), function (error, result) {
    if (error) throw error
    // 获取数据库基本信息
    dbinfo.tables = []
    dbinfo.name = result.Model['o:RootObject'][0]['c:Children'][0]['o:Model'][0]['a:Name'][0]
    dbinfo.code = result.Model['o:RootObject'][0]['c:Children'][0]['o:Model'][0]['a:Code'][0]
    dbinfo.createdate = result.Model['o:RootObject'][0]['c:Children'][0]['o:Model'][0]['a:CreationDate'][0]
    dbinfo.creator = result.Model['o:RootObject'][0]['c:Children'][0]['o:Model'][0]['a:Creator'][0]
    dbinfo.modifydate = result.Model['o:RootObject'][0]['c:Children'][0]['o:Model'][0]['a:ModificationDate'][0]
    dbinfo.modifier = result.Model['o:RootObject'][0]['c:Children'][0]['o:Model'][0]['a:Modifier'][0]
    dbinfo.dbtype = result.Model['o:RootObject'][0]['c:Children'][0]['o:Model'][0]['c:DBMS'][0]['o:Shortcut'][0]['a:Code'][0]
    dbinfo.dbtypename = result.Model['o:RootObject'][0]['c:Children'][0]['o:Model'][0]['c:DBMS'][0]['o:Shortcut'][0]['a:Name'][0]
    let tables = result.Model['o:RootObject'][0]['c:Children'][0]['o:Model'][0]['c:Tables'][0]['o:Table']
    for (let tableitem of tables) {
      if (tableitem && tableitem['$'] && tableitem['$']['Id'] && tableitem['a:Name'] && tableitem['a:Name'][0] && tableitem['a:Code'] && tableitem['a:Code'][0]) {
        let _table = JSON.parse(JSON.stringify(table))
        _table.tableid = tableitem['$']['Id']
        _table.tablename = tableitem['a:Name'][0]
        _table.tablecode = tableitem['a:Code'][0]
        _table.columns = []
        let columns = tableitem['c:Columns'] ? tableitem['c:Columns'][0] ? tableitem['c:Columns'][0]['o:Column'] : [] : []
        for (let columnitem of columns) {
          let _column = JSON.parse(JSON.stringify(column))
          _column.columnid = columnitem['$']['Id']
          _column.columnname = columnitem['a:Name'][0]
          _column.columnid = columnitem['a:Code'][0]
          _column.ismainkey = false
          _column.datatype = columnitem['a:DataType'][0]
          _column.length = columnitem['a:Length'] ? columnitem['a:Length'][0] ? columnitem['a:Length'][0] : null : null
          _column.mandatory = columnitem['a:Mandatory'] ? columnitem['a:Mandatory'][0] ? columnitem['a:Mandatory'][0] : false : false
          _table.columns.push(_column)
        }
        dbinfo.tables.push(_table)
      }
    }
  })

  return dbinfo
}

exports = module.exports = getObjectFromPDM
