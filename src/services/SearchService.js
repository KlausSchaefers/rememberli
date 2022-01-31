
import Logger from '../util/Logger'
import * as Util from '../util/Util'
import * as RememberLi from './RememberLi'
import dayjs from 'dayjs'


export default class SearchService {

    constructor () {
        this.elements = {}
        this.tags = new Set()
        this.persons = new Set()
        this.months = new Set()
        this.years = new Set()
    }

    find(str) {
        Logger.log(2, "SearchService.find() > " , str)
        const result  = {}
  
        if (RememberLi.isValidQuery(str)) {
            let now = new Date().getTime()
            const query = RememberLi.parseQuery(str)
            Logger.log(1, "SearchService.find() > query: " , query.operator, query.terms)
            const elements = Object.values(this.elements)
            let scores = {}
            elements.forEach(e => {
                query.terms.forEach(term => {
    
                    let runFullText = true
                    if (RememberLi.isDueTerm(term)) {
                        if (Util.isDue(e, now)) {
                           this.incScore(scores, e)
                        }
                        runFullText = false
                    }

                    if (RememberLi.isTodoTerm(term)) {
                        if (RememberLi.matchesToDo(e.value)) {
                           this.incScore(scores, e)
                        }
                        runFullText = false
                    }


                    if (this.isMonthTerm(term)) {
                        Logger.log(1, "SearchService.find() > isMonthTerm: " , term, e.month)
                        if (e.month === term) {
                            this.incScore(scores, e)
                        }
                        runFullText = false
                    }

                    if (this.isYearTerm(term)) {
                        Logger.log(1, "SearchService.find() > isYearTerm: " , term)
                        if (e.year === term) {
                            this.incScore(scores, e)
                        }
                        runFullText = false
                    }

                    // we run full text only of there is no special query, e.g. ':due',
                    // to save some time.
                    if (runFullText) {
                        if (e.value.indexOf(term) >= 0) {
                            this.incScore(scores, e)
                        }
                    } 
                   
                   
                })
            })

            // assume AND
            let minScore = this.getMinScore(query)
            Logger.log(2, "SearchService.find() > minScore: " , minScore)
            for (let id in scores) {
                if (scores[id].score >= minScore) {
                    result[id] = scores[id]
                }
            }
            
        } else {
            Logger.log(2, "SearchService.find() > not valid" , str)
        }
        return result
    }

    isMonthTerm (term) {
        return this.months.has(term)
    }

    isYearTerm (term) {
        return this.years.has(term)
    }

    incScore (scores, e) {
        if (!scores[e.id]) {
            scores[e.id] = {score:0}
        }
        scores[e.id].score++
    }

    getMinScore (query) {
        if (query.operator === 'or') {
            return 1
        }
        return query.terms.length
    }

   
    isValidQuery (query) {
       return RememberLi.isValidQuery(query)
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
        let text = Util.getText(element.value).toLocaleLowerCase()

        // index year and month. 
        let created = dayjs(element.created)
        let month = ':' + created.format('MMMM').toLocaleLowerCase()
        let year = ':' + created.format('YYYY').toLocaleLowerCase()
        
        this.elements[element.id] = {
            value : text,
            month: month,
            year: year,
            due: element.due,
            id: element.id
        }

        this.indexTags(text)
        this.indexPersons(text)
        this.indexDate(month, year)
    }

    indexDate (month, year) {
        this.months.add(month)
        this.years.add(year)
    }

    indexTags (text) {
        let tags = text.match(/(#[a-zA-Z0-9\-_]+)/g)
        if (tags) {
            tags.forEach(t => this.tags.add(t.toLocaleLowerCase()))
        }
    }

    indexPersons (text) {
        let persons = text.match(/(@[a-zA-Z0-9\-_]+)/g)
        if (persons) {
            persons.forEach(p => this.persons.add(p.toLocaleLowerCase()))
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
        this.months.forEach(m => {
            if (!list.includes(m)) {
                list.push(m)
            }
        })
        this.years.forEach(y => {
            if (!list.includes(y)) {
                list.push(y)
            }
        })
    }
}