module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  transpileDependencies: ['vuex-persist', 'vuetify'],
  publicPath: process.env.VUE_APP_PATH,
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js'
    }
  }
}
