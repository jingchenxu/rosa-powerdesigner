'use strict'

import { app, protocol, BrowserWindow, ipcMain, Menu } from 'electron'
import {
  createProtocol
  // installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const getObjectFromPDM = require('./back/getObjectFromPDM')
const fileExport = require('./back/fileExport')
const path = require('path')
const storage = require('electron-json-storage')
const os = require('os')
const isDevelopment = process.env.NODE_ENV !== 'production'

storage.setDataPath(os.tmpdir())
console.log(storage.getDataPath())

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // 判断如果是生产环境 隐藏窗口菜单栏
  if (!isDevelopment) {
    Menu.setApplicationMenu(null)
  }
  // Create the browser window.
  win = new BrowserWindow({ width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    } })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }
    BrowserWindow.addDevToolsExtension('C:/Users/ASUS/AppData/Local/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.3.0_0')
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

// 监听获取PDM路径
ipcMain.on('get-file-path', function (event, filePath) {
  filePath = path.resolve(filePath)
  storage.get('dblist', function (err, data) {
    if (err) throw err
    let ishave = false
    for (let filePathItem of data) {
      if (filePathItem === filePath) {
        ishave = true
      }
    }
    if (!ishave) {
      console.log(data)
      data.push(filePath)
      storage.set('dblist', data, function (error) {
        if (error) throw error
      })
    }
  })
  let dbInfo = getObjectFromPDM(filePath)
  win.webContents.send('update-dbmap', filePath, dbInfo)
})

// 在页面加载完成之后
ipcMain.on('app-init', function (event, sign) {
  console.log('应用开始初始化配置数据')
  // TODO 查询是否存在PDM地址列表文件
  // TODO 如果不存在空配置文件 则创建一个空的配置文件
  // TODO 如果存在配置文件则读取配置文件内容 并读取PDM内容
  storage.has('dblist', function (err, haskey) {
    if (err) throw err
    if (haskey) {
      console.log('有文件')
      storage.get('dblist', function (err, data) {
        if (err) throw err
        console.dir(data)
        for (let filePath of data) {
          let dbInfo = getObjectFromPDM(filePath)
          win.webContents.send('update-dbmap', filePath, dbInfo)
        }
      })
    } else {
      console.log('没有文件')
      storage.set('dblist', [], function (error) {
        if (error) throw error
      })
    }
  })

  storage.has('templateList', function (err, haskey) {
    if (err) throw err
    if (haskey) {
      console.log('加载代码模板')
      storage.get('templateList', function (err, data) {
        if (err) throw err
        win.webContents.send('updateTemplateList', data)
      })
    } else {
      storage.set('templateList', [], function (error) {
        if (error) throw error
      })
    }
  })

  // 代码导出
  ipcMain.on('code-export', function (event, file) {
    fileExport(win, file.code, file.fileType, file.fileName)
  })
})

// 监听模板列表发生修改进行更新
ipcMain.on('updateTemplateList', function (event, templateList) {
  storage.set('templateList', templateList)
})
