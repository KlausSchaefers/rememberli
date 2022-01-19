import Logger from '../util/Logger'
import * as Util from '../util/Util'

export default class SearchService {

    constructor () {
        this.elements = {}
        this.tags = new Set()
        this.persons = new Set()
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

        this.indexTags(text)
        this.indexPersons(text)
    }

    indexTags (text) {
        let tags = text.match(/(#[a-zA-Z0-9\-_]+)/g)
        if (tags) {
            tags.forEach(t => this.tags.add(t))
        }
    }

    indexPersons (text) {
        let persons = text.match(/(@[a-zA-Z0-9\-_]+)/g)
        if (persons) {
            persons.forEach(p => this.persons.add(p))
        }
    }

    updateTagsAndPersons (list) {
        Logger.log(1, 'SearchService.getTagsAndPersons() > enter')
        this.tags.forEach(t => {
            if (!list.includes(t)) {
                list.push(t)
            }
        })
        this.persons.forEach(p => {
            if (!list.includes(p)) {
                list.push(p)
            }
        })
    }
}