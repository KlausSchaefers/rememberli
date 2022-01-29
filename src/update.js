
import { autoUpdater } from "electron-updater"

export function init () {
    console.log('update.init()')
    autoUpdater.checkForUpdatesAndNotify()
}
