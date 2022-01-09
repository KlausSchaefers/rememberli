export function getTextWithLineBreaks(html) {
    const node = document.createElement('div')
    node.innerHTML = html
    return _getTextWithLineBreaks(node, false)
}

export function _getTextWithLineBreaks (node, isOnFreshLine) {
    let result = ''
    const childNodes = node.childNodes
    for (let i = 0; i < childNodes.length; i++) {
        const childNode = childNodes[i];
    
        if (childNode.nodeName === 'BR') {
            // BRs are always line breaks which means the next loop is on a fresh line
            result += '\n';
            isOnFreshLine = true;
            continue;
        }
    
        // We may or may not need to create a new line
        if (childNode.nodeName === 'DIV' && isOnFreshLine === false) {
            result += '\n';
        }
    
        isOnFreshLine = false;
    
        if (childNode.nodeType === 3 && childNode.textContent) {
            result += childNode.textContent;
        }
    
        // If this node has children, get into them as well:
        result += _getTextWithLineBreaks(childNode, isOnFreshLine);
    }
    return result
}

export function getText(html) {

    // some hack to endure we have white spaces
    html = html.replaceAll(new RegExp(`<`, 'gi'), ' <')

    // make sure we do not get any evil html in here
    const decoder = document.createElement('div')
   
    // we should somehow check that the content is ok...
    decoder.innerHTML = `<div contenteditable="true" >${html}</div>`

    // clean up and remove all 
    return decoder.innerText
        .split(' ')
        .filter(s => s !== '')
        .join(' ')
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
