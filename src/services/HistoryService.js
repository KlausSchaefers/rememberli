import Logger from '../util/Logger'

export default class HistoryService {

    constructor () {
        this.undos = []
        this.redos = []
    }


    change (element, value) {
        Logger.log(3, 'HistoryService.change()', element, value)
        this.undos.push({
            type: 'Change',
            id: element.id,
            oldValue: element.value,
            newValue:value 
        })
    }

    add (element, pos) {
        Logger.log(3, 'HistoryService.add()', element, pos)
        this.undos.push({
            type: 'Add',
            id: element.id,
            position: pos,
            newValue:element 
        })
    }

    delete (element, file) {
        Logger.log(3, 'HistoryService.delete()', element, file)
        let index = file.content.elements.findIndex(e => e.id === element.id)
        this.undos.push({
            type: 'Delete',
            id: element.id,
            index: index,
            deletedElement:element 
        })
    }

    undo (file) {
        Logger.log(-1, 'HistoryService.undo()')

        if (this.undos.length > 0) {
            let delta = this.undos.pop()
            switch (delta.type) {
                case 'Change':
                    this.undoChange(delta, file)
                    break
                case 'Add':
                    this.undoAdd(delta, file)
                    break
                case 'Delete':
                    this.undoDelete(delta, file)
                    break
                default:
                    Logger.warn('HistroyService.undo() > Unsuported Type', delta.type)
                    break
            }
        }
        
    }

    undoChange (delta, file) {
        Logger.log(-1, 'HistoryService.undoChange()', delta.id, delta.oldValue)
        let element = file.content.elements.find(e => e.id === delta.id)
        if (element) {
            element.value = delta.oldValue
            this.redos.push(delta)
        } else {
            Logger.log(-1, 'HistoryService.undoChange() > cannot find element')
        }
    }

    undoAdd (delta, file) {
        Logger.log(-1, 'HistoryService.undoAdd()', delta.id, delta.position)
        if (delta.position === 'start') {
            file.content.elements.shift()
            this.redos.push(delta)
        }
        if (delta.position === 'end') {
            file.content.elements.pop()
            this.redos.push(delta)
        }
    }

    undoDelete (delta, file) {
        Logger.log(-1, 'HistoryService.undoDelete() > enter ' + delta.id, file.content.elements.length, delta) 
        let index = delta.index
        let element = delta.deletedElement
        file.content.elements.splice(index, 0, element); 
        Logger.log(-1, 'HistoryService.undoDelete() > exit ', file.content.elements.length, file) 
    }

}