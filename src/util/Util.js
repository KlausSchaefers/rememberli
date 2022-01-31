import Logger from './Logger'
/**
 *  enterring a<enter><enter>b will give such an HTML
 * 
 *  a
 *  <div>
 *      <br>
 *  </div>
 *  <div>
 *      b
 *  </div>
 * 
 * or abc<enter><tab>1<enter><tab>2<enter> will give HTML such as
 * 
 *  abc
 *  <div>
 *  	1<br>
 *  </div>
 *  <div>
 *  	2<br>
 *  </div>
 * 
 * or we get somethink after editing and existing element
 * 
 *  abc\n\t1\n\t2\n\t3\n  <- Here the \n will creak already a line break. 
 *  <div>
 *      \t4<br>
 *  </div>
 * 
 *  The shitty part is <div><br><div> or 
 * 
 *  When we ask for innerText it will have three line breaks
 */

export function innerText (node, lastChildWasBr =  {isTrue: true}, level = 0) {

    if (level === 0) {
        console.debug('innerText', JSON.stringify({html: node.innerHTML}))
    }

    let result = ''
    const childNodes = node.childNodes
    
    for (let i = 0; i < childNodes.length; i++) {
        const childNode = childNodes[i];
        if (childNode.nodeName === 'DIV') {
            if (!lastChildWasBr.isTrue) {
                result += '\n';
            }
        }
        lastChildWasBr.isTrue = false
        if (childNode.nodeName === 'BR') {
            result += '\n';
            lastChildWasBr.isTrue = true
            continue;
        }
        if (childNode.nodeType === 3 && childNode.textContent) {
            let text = childNode.textContent
            Logger.space(level + 1, childNode.text)
            result += text;
            /**
             * If the text index with a \n, we should ignore
             * the next DIV
             */
            if (text.lastIndexOf('\n') === text.length - 1) {
                lastChildWasBr.isTrue = true
            }
        }
        if (!isDivWithBRChild(childNode)) {
            result += innerText(childNode, lastChildWasBr, level+1);
        }
    }
    return result
}

function isDivWithBRChild(node) {
    return node.nodeName === 'DIV' && (node.innerHTML === '<br>' || node.innerHTML === '<br/>')
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


export function on (node, event, callback) {
    if (node && node.toLowerCase) {
        node = document.getElementById(node)
    }
    if (node && node.addEventListener) {
        node.addEventListener(event, callback)
        return {
            'callback': callback,
            'node': node,
            'event': event,
            'remove': function () {
                this.node.removeEventListener(this.event, this.callback)
            }
        }
    }
}

export function body () {
    return document.getElementsByTagName("BODY")[0]
}

export function replaceLastPart (str, part) {
    let parts = str.split(' ')
    if (parts.length > 1) {
        parts[parts.length - 1] = part
        return parts.join(' ')
    }
    return part
}

export function isDue(e, now) {
    return e.due && e.due < now
}

export function stopEvent(e) {
    e.preventDefault()
    e.stopPropagation()
}