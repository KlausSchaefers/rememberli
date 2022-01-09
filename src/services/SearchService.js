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
                  
                    if (e.value.indexOf(part) >= 0) {
                        if (!result[e.id]) {
                            result[e.id] = {score:0}
                        }
                        result[e.id].score++
                    }
                })
            })
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
        if (file.content && file.content.elements) {
            file.content.elements.forEach(e => {
                this.indexElement(e)
            })
        }
    }

    indexElement (element) {
        Logger.log(3, "SearchService.indexElement() > ", element.id)
        let text = Util.getText(element.value).toLowerCase()
        this.elements[element.id] = {
            value : text,
            id: element.id
        }
    }
}