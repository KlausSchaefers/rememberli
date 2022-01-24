export function highlight (html){
    let result = html.replace(/(#[a-zA-Z0-9\-_&]+)/g,'<span data-rmli-type="person" class="rmi-highlight-tag">$1</span>')
    result = result.replace(/(@[a-zA-Z0-9\-_&]+)/g,'<span data-rmli-type="person" class="rmi-highlight-person">$1</span>')
    result = replaceTasksDiv(result)
    //result = replaceAll(result, '-&gt;','<i class="ri-arrow-right-line rmi-highlight-icon"></i>')
    result = replaceAll(result, '->','<i class="ri-arrow-right-line rmi-highlight-icon"></i>')
    return result
}

export function replaceTasksIcon (result) {
    result = result.replace(/\[\]/g,'<span data-rmli-type="task" class="ri-checkbox-blank-line"></span>')
    result = result.replace(/\[\s\]/g,'<span data-rmli-type="task" class="ri-checkbox-blank-line"></span>')
    result = result.replace(/\[x\]/gi,'<span data-rmli-type="task" class="ri-checkbox-line"></span>')
    return result
}

export function replaceTasksDiv (result) {
    result = result.replace(/\[\]/g,'<span data-rmli-type="task" class="rmi-highlight-task rmi-highlight-task-open"></span>')
    result = result.replace(/\[\s\]/g,'<span data-rmli-type="task" class="rmi-highlight-task rmi-highlight-task-open"></span>')
    result = result.replace(/\[x\]/gi,'<span data-rmli-type="task" class="rmi-highlight-task rmi-highlight-task-done"></span>')
    return result
}

function replaceAll(str, needle, replace) {
    return str.split(needle).join(replace)
}