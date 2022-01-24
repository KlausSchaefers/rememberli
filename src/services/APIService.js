import Logger from '../util/Logger'

var saveListener = null

var loadListener = null

var selectListener = null

var logListner = null

export default class APIService {
    
    constructor () {
        this.cleanUp()
        this.init()
    }

    async init () {
        let ipcRenderer = window.ipcRenderer
        saveListener = await ipcRenderer.receive('save:reply', (e) => {
            this.onSaveReply(e)
        })
        
        loadListener = await ipcRenderer.receive('load:reply', (e) => {
            this.onLoadReply(e)
        })
        
        selectListener = await ipcRenderer.receive('select:reply', (e) => {
            this.onSelectReply(e)
        })

        logListner = await ipcRenderer.receive('log:reply', (e) => {
            this.onLogReply(e)
        })
    }

    onAppLoaded () {
        Logger.log(-2, 'APIService.onAppLoaded()')
        let ipcRenderer = window.ipcRenderer
        ipcRenderer.send('openFileExtensionOnStart')
    }

    getElectronLog () {
        Logger.log(-2, 'APIService.getElectronLog()')
        let ipcRenderer = window.ipcRenderer
        ipcRenderer.send('log')
    }

    onLogReply (data) {
        Logger.log(-2, 'APIService.onLogReply()', data)
        console.table(data.log)
    }

    cleanUp () {
        try {
            let ipcRenderer = window.ipcRenderer
            if (saveListener) {
                ipcRenderer.removeListener('save:reply', saveListener)
            }
            if (loadListener) {
                ipcRenderer.removeListener('load:reply', loadListener)
            }
            if (selectListener) {
                ipcRenderer.removeListener('select:reply', selectListener)
            }
            if (logListner) {
                ipcRenderer.removeListener('log:reply', logListner)
            }
        } catch (err) {
            Logger.error('APIService.cleanUp', err)
        }
       
    }

    openLink (e) {
        Logger.log(-2, 'APIService.openLink()', e)
        e.stopPropagation()
        e.preventDefault()
        if (e.target && e.target.href) {
            let href = e.target.href
            let ipcRenderer = window.ipcRenderer
            ipcRenderer.send('openLink', href)
        } 
    }

    save (content) {
        Logger.log(2, 'APIService.save()', content)
        let ipcRenderer = window.ipcRenderer
        ipcRenderer.send('save', JSON.stringify(content, null, 2))
    }

    onSaveReply (e) {
        Logger.log(2, 'APIService.onSaveReply()', e)
        if (this.saveReplyCallback) {
            this.saveReplyCallback(e)
        }
    }

    onSave(callback) {
        this.saveReplyCallback = callback
    }

    onLoadReply (e) {
        Logger.log(2, 'APIService.onLoadReply()', e)
        if (this.loadReplyCallback) {
            this.loadReplyCallback(e)
        }
    }

    load (fileName) {
        Logger.log(2, 'APIService.load()', fileName)
        let ipcRenderer = window.ipcRenderer
        ipcRenderer.send('load', fileName)
    }

    onLoad(callback) {
        this.loadReplyCallback = callback
    }

    onSelectReply (e) {
        Logger.log(2, 'APIService.onSelectReply()', e)
        if (this.selectReplyCallback) {
            this.selectReplyCallback(e)
        }
    }

    onSelect(callback) {
        this.selectReplyCallback = callback
    }

    select () {
        Logger.log(2, 'APIService.select()')
        let ipcRenderer = window.ipcRenderer
        ipcRenderer.send('select', '')   
    }

}