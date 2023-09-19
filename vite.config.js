import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import requireTransform from 'vite-plugin-require-transform'
import { createHtmlPlugin } from 'vite-plugin-html'
import VueMacros from 'unplugin-vue-macros/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import vueJsx from '@vitejs/plugin-vue-jsx'
export default defineConfig({
  configureWebpack: {
    resolve: { extensions: ['.ts', '.tsx', '.js', '.json'] },
    module: {
      rules: [
        {
          test: /.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/.vue$/]
          }
        }
      ]
    }
  },
  css: {
    postcss: {
      plugins: [
        require('postcss-px2rem')({
          // 以设计稿750为例， 750 / 10 = 75
          remUnit: 192
        })
      ]
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.includes('easy-player')
        }
      }
    }),
    vueJsx(), // jsx
    requireTransform({
      fileRegex: /.vue$/
    }),
    createHtmlPlugin({
      inject: {
        data: {
          title: '智能视觉生产管理系统'
        }
      }
    }),
    VueMacros(),
    AutoImport({
      imports: ['vue', 'vue/macros', 'vue-router', 'pinia'], // 自动导入vue和vue-router相关函数
      dts: 'src/typings/auto-import.d.ts', // 生成 `auto-import.d.ts` 全局声明
      resolvers: [
        ElementPlusResolver(), // 自动导入element-plus相关组件
        IconsResolver({
          // 自动导入图标组件
          prefix: 'Icon'
        })
      ],
      eslintrc: {
        enabled: false, // 自动生成全局声明文件, 不需要eslint检查(在.eslintrc-auto-import.json生成成功之后就可以改为false, 当你更新了导入配置后,将其改为true即可重新生成一次)
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true
      }
    }),
    Components({
      dts: 'src/typings/components.d.ts',
      resolvers: [
        IconsResolver({
          // 自动注册图标组件 how to use: <i-ep-location />
          enabledCollections: ['ep'] // 'ep'是element图标集在https://iconify.design/ 里的集合名, 如果你引入或`使用了其他图标集, 需要在此把其集合名写上
          // 本地svg图标集合
          // customCollections: [collectionName],
          // componentPrefix: "icon", // 与element-plus的prefix配置冲突(本地图标使用: <i-local-iconName />)
        }),
        ElementPlusResolver({
          // importStyle: 'sass',
        }) // 自动导入element-plus相关组件
      ]
    }),
    // see: https://github.com/antfu/unplugin-icons
    Icons({
      // 自动导入图标组件 图标来源: https://iconify.design/
      autoInstall: true,
      // 本地图标
      compiler: 'vue3',
      // customCollections: {
      //   [collectionName]: FileSystemIconLoader(localIconPath),
      // },
      scale: 1,
      defaultClass: 'inline-block'
    })
  ],
  server: {
    proxy: {
      '/prodApi': {
        target: 'http://172.18.8.244:20204/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/prodApi/, '')
      },
      '/api': {
        target: 'http://10.0.103.64:31500/',
        // target: 'http://172.18.8.244:20204/api',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      },
      '/uuacApi': {
        target: 'http://192.168.36.68:32334/api',
        // target: 'http://172.18.8.244:8111/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/uuacApi/, '')
      },
      '/deviceApi': {
        target: 'http://192.168.36.62:32431/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/deviceApi/, '')
      },
      '/channelApi': {
        target: 'http://192.168.36.62:30677/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/channelApi/, '')
      },
      '/videoUrlApi': {
        target: 'http://192.168.36.70:30447/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/videoUrlApi/, '')
      },
      '/XCQXApi': {
        target: 'http://192.168.36.68:30012/',
        // target: 'http://172.18.8.244:20204/XCQXApi',
        rewrite: path => path.replace(/^\/XCQXApi/, '')
      },
      '/AgvApi': {
        target: 'http://172.18.8.244:20204/AgvApi',
        rewrite: path => path.replace(/^\/AgvApi/, '')
      }
    }
  },
  resolve: {
    //设置路径别名
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
