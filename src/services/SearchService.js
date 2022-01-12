import Logger from '../util/Logger'
import * as Util from '../util/Util'

export default class SearchService {

    constructor () {
        this.elements = {}
    }

    find(query) {
        Logger.log(-1, "SearchService.find() > " , query)
        const result  = {}
        if (this.isValidQuery(query)) {
            const parts = query.toLowerCase().split(' ')
            const elements = Object.values(this.elements)
            elements.forEach(e => {
                parts.forEach(part => {
                    if (this.isValidQuery(part)) {
                        console.debug(' search for', part, e.value)
                        if (e.value.indexOf(part) >= 0) {
                            if (!result[e.id]) {
                                result[e.id] = {score:0}
                            }
                            result[e.id].score++
                        }
                    }
                })
            })
        } else {
            Logger.log(-1, "SearchService.find() > not valid" , query)
        }
        return result
    }

    isValidQuery (query) {
        return query && (query.length > 2 || this.isTagQuery(query) || this.isPersonQuery(query))
    }

    isPersonQuery (query) {
        return query.indexOf('@') && query.length > 1
    }

    isTagQuery (query) {
        return (query.indexOf('#') && query.length > 1)
    }

    indexAll (file) {
        Logger.log(3, "SearchService.indexAll()")
        this.elements = {}
        if (file.content && file.content.elements) {
            file.content.elements.forEach(e => {
                this.indexElement(e)
            })
        }
    }

    indexElement (element) {
        Logger.log(3, "SearchService.indexElement() > ", element.id)
        let text = Util.getText(element.value).toLowerCase()

        if (element.due && element.due < new Date().getTime()) {
            text += ' due'
        }
       
        this.elements[element.id] = {
            value : text,
            id: element.id
        }
    }
}