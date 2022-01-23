
import Logger from '../util/Logger'
import * as Util from '../util/Util'

export default class SearchService {

    constructor () {
        this.elements = {}
        this.tags = new Set()
        this.persons = new Set()
    }

    find(str) {
        Logger.log(-1, "SearchService.find() > " , str)
        const result  = {}
  
        if (this.isValidQuery(str)) {
            let now = new Date().getTime()
            const query = this.parseQuery(str)
            Logger.log(-1, "SearchService.find() > query: " , query.operator, query.terms)
            const elements = Object.values(this.elements)
            let scores = {}
            elements.forEach(e => {
                query.terms.forEach(term => {
                      
                    if (this.isDueQuery(term)) {
                        if (Util.isDue(e, now)) {
                            if (!scores[e.id]) {
                                scores[e.id] = {score:0}
                            }
                            scores[e.id].score++
                        }
                    }

                    if (e.value.indexOf(term) >= 0) {
                        if (!scores[e.id]) {
                            scores[e.id] = {score:0}
                        }
                        scores[e.id].score++
                    }
                   
                })
            })

            // assume AND
            let minScore = this.getMinScore(query)
            Logger.log(-1, "SearchService.find() > minScore: " , minScore)
            for (let id in scores) {
                if (scores[id].score >= minScore) {
                    result[id] = scores[id]
                }
            }
            
        } else {
            Logger.log(-1, "SearchService.find() > not valid" , str)
        }
        return result
    }

    getMinScore (query) {
        if (query.operator === 'or') {
            return 1
        }
        return query.terms.length
    }

    parseQuery (str) {
        const parts = str.toLowerCase().split(' ')
        let terms = []
        let operator = 'and'

        parts.forEach(part => {
            if (this.isLogicAnd(part)) {
                operator = 'and'
            } else if (this.isLogicOr(part)) {
                operator = 'or'
            } else if (this.isValidQuery(part)) {
                terms.push(part)
            }
        })
        return {
            operator: operator,
            terms: terms
        }
    }

    isDueQuery (query) {
        return query === 'due'
    }

    isLogicOr (query) {
        return query === 'or' || query === '|'
    }

    isLogicAnd (query) {
        return query === 'and' || query === '&'
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

        // FIXME: add the month?
       
        this.elements[element.id] = {
            value : text,
            due: element.due,
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