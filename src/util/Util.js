export function getText(html) {
    // FIXME: we miss white spaces. we could add them as " "
    const decoder = document.createElement('div')
    // make sure we do not get any evil html in here
    decoder.innerHTML = replaceAllowedTags(html)
    return decoder.innerText  
}

export function cleanInnerHTML(s) {
    const decoder = document.createElement('div')
    decoder.innerText = s
    let sanitized = decoder.innerHTML  
    return replaceAllowedTags(sanitized)
}

export function replaceAllowedTags (sanitized, allowedTags = ['b', 'i', 'div', 'p', 'label', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol',' li', 'br', 'hr', 'blockquote']) {
    allowedTags.forEach(tag => {
        let needle = new RegExp(`&lt;${tag}&gt;`, 'gi')
        let replace = `<${tag}>`
        sanitized = sanitized.replaceAll(needle, replace)

        needle = new RegExp(`&lt;/${tag}&gt;`, 'gi')
        replace = `</${tag}>`
        sanitized = sanitized.replaceAll(needle, replace)
    })
    return sanitized
}
