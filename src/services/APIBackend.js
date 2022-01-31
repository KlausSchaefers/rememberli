import { ipcMain } from 'electron'
import APILogger from './APILogger'
import {dialog} from 'electron'
import fs from 'fs'
import electron from 'electron'

export function init() {

    ipcMain.on('save', save)
    ipcMain.on('load', load)
    ipcMain.on('select', select)
    ipcMain.on('openLink', openLink)
    ipcMain.on('openFileExtensionOnStart', openFileExtensionOnStart)
    ipcMain.on('log', getElectronLog)
}

async function getElectronLog (event) {
    APILogger.log(-3,'APIBackend.getElectronLog() > enter', process.argv)
    event.reply('log:reply', {
        log: APILogger.getEntries()
    })
        
}

async function openFileExtensionOnStart (event) {
    APILogger.log(-3,'APIBackend.openFileExtensionOnStart() > enter', process.argv)
    if (process.argv.length >= 2) {
        var openFilePath = process.argv[1];
        if (openFilePath.indexOf('.rmli') > 0 && fs.existsSync(openFilePath)) {
            let data = fs.readFileSync(openFilePath, 'utf8')
            let content = JSON.parse(data)
            APILogger.log(3,'APIBackend.openFileExtensionOnStart() > openFilePath', openFilePath) 
            event.reply('select:reply', {
                url: openFilePath,
                content: content
            })
        }
    }
    
}

async function openLink (event, data) {
    APILogger.log(-3,'APIBackend.openLink() > enter', data)
    electron.shell.openExternal(data)
}
async function save (event, data) {
    APILogger.log(3,'APIBackend.save() > enter', data)
    let file = JSON.parse(data)
    /**
     * Create a new file of not present
     */
    if (!file.url) {
        let result = await dialog.showSaveDialog({ properties: ['createDirectory'] })
        APILogger.log(-1,'APIBackend.save() > new', result)
        if (!result.canceled) {
            file.url = result.filePath + '.rmli'
            APILogger.log(-1,'APIBackend.save() > new', file.url)
        }
    }
    /**
     * Save file if we have an URL (might be canceled)
     */
    if (file.url) {
        APILogger.log(1,'APIBackend.save() > write', file)
        fs.writeFileSync(file.url, JSON.stringify(file.content, null, 2))
        // TODO: just send the URL
        event.reply('save:reply', file)
    }
}

function load (event, path) {
    APILogger.log(-3,'APIBackend.load() > enter', path) 
    if (fs.existsSync(path)) {
        let data = fs.readFileSync(path, 'utf8')
        let content = JSON.parse(data)
        APILogger.log(3,'APIBackend.load() > select', content) 
        event.reply('select:reply', {
            url: path,
            content: content
        })
    }   
}

async function select (event, arg) {
    APILogger.log(3,'APIBackend.select() > select', arg) 
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
        APILogger.log(3,'APIBackend.select() > select', content) 
        event.reply('select:reply', {
            url: path,
            content: content
        })
    }
}