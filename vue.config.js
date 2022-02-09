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
          },
          mac: {                        
            hardenedRuntime : true,
            gatekeeperAssess: false,
            entitlements: "build/entitlements.mac.plist",
            entitlementsInherit: "build/entitlements.mac.plist"
          },
          linux: {
            maintainer: "KlausSchaefers",
            category: "Utility"
          }
        }
      }
    }
  }