const { contextBridge, ipcRenderer } = require('electron')
console.debug('......................')
console.debug('Preload')
console.debug('......................')
contextBridge.exposeInMainWorld(
  'electron',
  {
    doThing: () => ipcRenderer.send('do-a-thing')
  }
)

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => {
      ipcRenderer.send(channel, data)
    },
    receive: (channel, func) => {
       ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
})
