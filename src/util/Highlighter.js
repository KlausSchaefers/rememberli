export function highlight (html){
    let result = html.replace(/(#[a-zA-Z0-9\-_]+)/g,'<span class="rmi-highlight-tag">$1</span>')
    result = result.replace(/(@[a-zA-Z0-9\-_]+)/g,'<span class="rmi-highlight-person">$1</span>')
    return result
}