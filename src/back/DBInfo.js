class Column {
  constructor () {
    this.columnid = ''
    this.columnname = ''
    this.columnid = ''
    this.ismainkey = false
    this.datatype = ''
    this.length = ''
    this.mandatory = ''
  }
}

class Table {
  constructor () {
    this.tableid = ''
    this.tablename = ''
    this.tablecode = ''
    this.columns = []
  }
}

class DBInfo {
  constructor () {
    this.name = ''
    this.code = ''
    this.createdate = ''
    this.creator = ''
    this.modifydate = ''
    this.modifier = ''
    this.dbtype = ''
    this.dbtypename = ''
    this.tables = [

    ]
  }
}

exports = module.exports = { dbinfo: new DBInfo(), table: new Table(), column: new Column() }
