import { ipcMain } from 'electron'
import Logger from '../util/Logger'

export function init() {

    ipcMain.on('save', save)
      
}

function save (event, arg) {
    Logger.log(-1,'APIBackend.save() > enter', arg) // prints "ping"
    event.reply('save:reply', {data:1})
}