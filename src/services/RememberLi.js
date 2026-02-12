export const TERMS = {
    TODO: ':todo',
    DUE: ':due',
    FOCUS: ':focus',
    CODE: ':code'
}

export function isDueTerm (query) {
    return query === TERMS.DUE
}

export function isCodeTerm (query) {
    return query === TERMS.CODE
}

export function isDueQuery (str) {
    return str.indexOf(TERMS.DUE) >=0
}

export function isFocusQuery(query) {
    return query.indexOf(TERMS.FOCUS) >=0
}

export function isFocusTerm (term) {
    return term === TERMS.FOCUS
}

export function isTodoQuery (str) {
    return str.indexOf(TERMS.TODO) >=0
}

export function isCodeQuery (str) {
    return str.indexOf(TERMS.CODE) >=0
}

export function isTodoTerm (query) {
    return query === TERMS.TODO
}

export function matchesToDo (value) {
    return value.indexOf('[]') >= 0 || value.indexOf('[ ]') >= 0 || value.indexOf('[x]') >= 0
}

export function matchesCode (value) {
    return value.indexOf('```') >= 0 || value.indexOf('`') >= 0
}

export function isLogicOr (query) {
    return query === 'or' || query === '|'
}

export function isLogicAnd (query) {
    return query === 'and' || query === '&'
}

export function isValidQuery (query) {
    return query && (query.length > 2 || isTagQuery(query) || isPersonQuery(query))
}

export function isPersonQuery (query) {
    return query.indexOf('@') === 0 && query.length > 1
}

export function isTagQuery (query) {
    return (query.indexOf('#') === 0 && query.length > 1)
}

export function isDue(e, now) {
    return e.due && e.due < now
}

const newValue=`
This is an example. Click on it to see the markup. 

You can use the following markup codes:
- @person To tag a person.
- #tag To tag a topic.
- -> To insert an arrow icon.
            
You can also create tasks:
- [] This is an open task.
- [x] This is a done task.

You can also use code markup:
\`\`\`
This is a code block
\`\`\`   

Add variable like {some_variable} to insert dynamic content in the future.
\`\`\`
This is a code block with variable {some_variable}
\`\`\` 
`.trim()

export function createFile () {
    let now = getTimestamp()
    return {
        url: '',
        content: {
          created: now,
          lastUpdate: now,
          name: 'New File',
          folders: [],
          elements: [{
            id: 'n' + now,
            created: now,
            firstCreate: now,
            lastUpdate: now,
            elements:[],
            pinned:false,
            type: 'Note',
            value: newValue,
            folder: ''
          }]
        }
    }
}

export function getTimestamp () {
    return new Date().getTime()
}


export function parseQuery (str) {
    const parts = str.toLowerCase().split(' ')
    let terms = []
    let operator = 'and'

    parts.forEach(part => {
        if (isCodeQuery(part)) {
            operator = 'and'
        }
        if (isLogicAnd(part)) {
            operator = 'and'
        } else if (isLogicOr(part)) {
            operator = 'or'
        } else if (isValidQuery(part)) {
            terms.push(part)
        }
    })
    return {
        operator: operator,
        terms: terms
    }
}
