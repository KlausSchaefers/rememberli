module.exports = {
    pluginOptions: {
      electronBuilder: {
        preload: 'src/preload.js',
        nodeIntegration: false,
        builderOptions: {
          publish: ['github'],
          fileAssociations: {
            ext: "rmli",
            name: "RememberLi File",
            role: "Editor"
          }
        }
      }
    }
  }