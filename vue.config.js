const pjson = require('./package.json')

const { name, version } = { ...pjson }

module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  runtimeCompiler: true,
  pluginOptions: {
    electronBuilder: {
      chainWebpackRendererProcess: config => {
        // Chain webpack config for electron main process only
        const prefixRE = /^ELECTRON_APP_/
        const resolveClientEnv = () => {
          const env = {}
          Object.keys(process.env).forEach(key => {
            if (prefixRE.test(key) || key === 'NODE_ENV') {
              env[key] = process.env[key]
            }
          })
          for (const key in env) {
            env[key] = JSON.stringify(env[key])
          }
          return {
            'process.env': env
          }
        }
        config.plugin('define').use(require('webpack/lib/DefinePlugin'), [
          resolveClientEnv()
        ])
        return config
      },
      builderOptions: {
        productName: 'Rosa',
        appId: 'com.deepwater.rosa',
        copyright: 'jingchenxu2015@gmail.com',
        publish: [
          {
            provider: 'github',
            owner: 'jingchenxu2015@gmail.com',
            repo: 'rosa-powerdesigner',
            // token: '',
            url: 'http://www.deepwater.tech/codekeep/file/image'
          }
        ],
        directories: {
          output: 'build'
        },
        nsis: {
          oneClick: false,
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          installerIcon: 'public/icon.ico',
          uninstallerIcon: 'public/icon.ico',
          installerHeaderIcon: 'public/icon.ico',
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: 'rosa'
        },
        win: {
          icon: 'public/Rosa.ico',
          // eslint-disable-next-line no-undef
          artifactName: `${name}_setup_${version}.exe`,
          target: [
            {
              target: 'nsis'
            }
          ]
        }
      }
    }
  }
}
