export const TERMS = {
    TODO: ':todo',
    DUE: ':due',
    FOCUS: ':focus'
}

export function isDueTerm (query) {
    return query === TERMS.DUE
}

export function isFocusQuery(query) {
    return query.indexOf(TERMS.FOCUS) >=0
}

export function isFocusTerm (term) {
    return term === TERMS.FOCUS
}

export function isTodoQuery (str) {
    return str.indexOf(':todo') >=0
}

export function isTodoTerm (query) {
    return query === TERMS.TODO
}

export function matchesToDo (value) {
    return value.indexOf('[]') >= 0 || value.indexOf('[ ]') >= 0 || value.indexOf('[x]') >= 0
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
