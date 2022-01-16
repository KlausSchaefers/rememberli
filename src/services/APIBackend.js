import { ipcMain } from 'electron'
import Logger from '../util/Logger'
import {dialog} from 'electron'
import fs from 'fs'

export function init() {

    ipcMain.on('save', save)
    ipcMain.on('load', load)
    ipcMain.on('select', select)
}

async function save (event, data) {
    Logger.log(3,'APIBackend.save() > enter', data)
    let file = JSON.parse(data)
    /**
     * Create a new file of not present
     */
    if (!file.url) {
        let result = await dialog.showSaveDialog({ properties: ['createDirectory'] })
        Logger.log(-1,'APIBackend.save() > new', result)
        if (!result.canceled) {
            file.url = result.filePath + '.rmli'
            Logger.log(-1,'APIBackend.save() > new', file.url)
        }
    }
    /**
     * Save file if we have an URL (might be canceled)
     */
    if (file.url) {
        Logger.log(-1,'APIBackend.save() > write', file)
        fs.writeFileSync(file.url, JSON.stringify(file.content, null, 2))
        // TODO: just send the URL
        event.reply('save:reply', file)
    }
}

function load (event, arg) {
    Logger.log(3,'APIBackend.load() > enter', arg) 
    event.reply('load:reply', {data:1})
}

async function select (event, arg) {
    Logger.log(3,'APIBackend.select() > select', arg) 
    let result = await dialog.showOpenDialog({ 
        properties: ['openFile'],
        filters: [
            { name: 'RMLI', extensions: ['rmli'] }
        ]
    })
    if (!result.canceled && result.filePaths.length === 1) {
        let path = result.filePaths[0]
        let data = fs.readFileSync(path, 'utf8')
        let content = JSON.parse(data)
        Logger.log(3,'APIBackend.select() > select', content) 
        event.reply('select:reply', {
            url: path,
            content: content
        })
    }
}