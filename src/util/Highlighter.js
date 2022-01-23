export function highlight (html){
    let result = html.replace(/(#[a-zA-Z0-9\-_]+)/g,'<span class="rmi-highlight-tag">$1</span>')
    result = result.replace(/(@[a-zA-Z0-9\-_]+)/g,'<span class="rmi-highlight-person">$1</span>')
    result = result.replace(/\[\]/g,'<span class="rmi-highlight-task rmi-highlight-task-open"></span>')
    result = result.replace(/\[x\]/gi,'<span class=" rmi-highlight-task rmi-highlight-task-done"></span>')
    result = replaceAll(result, '-&gt;','<i class="ri-arrow-right-line rmi-highlight-icon"></i>')
    result = replaceAll(result, '->','<i class="ri-arrow-right-line rmi-highlight-icon"></i>')
    return result
}

function replaceAll(str, needle, replace) {
    return str.split(needle).join(replace)
}