class Highlighter {

    highlight (html){
        let result = html.replace(/(#[a-zA-Z0-9\-_&]+)/g,'<span data-rmli-type="person" class="rmi-highlight-tag">$1</span>')
        result = result.replace(/(@[a-zA-Z0-9\-_&]+)/g,'<span data-rmli-type="person" class="rmi-highlight-person">$1</span>')
        result = this.replaceTasksDiv(result)
        //result = replaceAll(result, '-&gt;','<i class="ri-arrow-right-line rmi-highlight-icon"></i>')
        result = this.replaceAll(result, '->','<i class="ri-arrow-right-line rmi-highlight-icon"></i>')
        return result
    }
    
    replaceTasksDiv (result) {
        result = result.replace(/\[\]/g, replaceOpenTodo)
        result = result.replace(/\[\s\]/g, replaceOpenTodo)
        result = result.replace(/\[x\]/gi,replaceClosedTodo)
        return result
    }


    replaceAll(str, needle, replace) {
        return str.split(needle).join(replace)
    }
    

}
export default new Highlighter()

function replaceOpenTodo (match, offset) {
    return `<span data-rmli-type="taskOpen" data-rmli-offset="${offset}" data-rmli-length="${match.length}"  class="rmi-highlight-task rmi-highlight-task-open"></span>`
}

function replaceClosedTodo (match, offset) {
    return `<span data-rmli-type="taskDone" data-rmli-offset="${offset}" data-rmli-length="${match.length}"  class="rmi-highlight-task rmi-highlight-task-done"></span>`
}

