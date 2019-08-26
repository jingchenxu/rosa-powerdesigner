const fs = require('fs')
const { dialog } = require('electron')

function fileExport (window, code, fileType, fileName) {
  let option = {
    title: '保存生成代码',
    defaultPath: fileName,
    filters: [
      { name: 'Code', extensions: [fileType] }
    ]
  }
  dialog.showSaveDialog(window, option, function (fullPath) {
    console.log(fullPath)
    if (fullPath) {
      fs.writeFileSync(
        fullPath,
        code,
        'utf8'
      )
    }
  })
}

exports = module.exports = fileExport
