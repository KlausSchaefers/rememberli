module.exports = {
    pluginOptions: {
      electronBuilder: {
        preload: 'src/preload.js',
        nodeIntegration: false,
        builderOptions: {
          fileAssociations: {
            ext: "rmli",
            name: "RememberLi File",
            role: "Editor"
          }
        }
      }
    }
  }