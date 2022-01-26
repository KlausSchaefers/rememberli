
class Highlighter {

    highlight (html){
        /**
         * Replace all the task first, because we need the position in the string. If
         * replace the tags or so, before the markup will change the positions
         */
        let result = this.replaceTasksDiv(html)
        result = result.replace(/(#[a-zA-Z0-9\-_&]+)/g,'<span data-rmli-type="person" class="rmi-highlight-tag">$1</span>')
        result = result.replace(/(@[a-zA-Z0-9\-_&]+)/g,'<span data-rmli-type="person" class="rmi-highlight-person">$1</span>')
        result = this.replaceAll(result, '->','<i class="ri-arrow-right-line rmi-highlight-icon"></i>')
        return result
    }
    
    replaceTasksDiv (result) {
        result = result.replace(/\[(\s|x|X)?\]/g, replaceTodo)       
        return result
    }

    replaceAll(str, needle, replace) {
        return str.split(needle).join(replace)
    }
    
    matchesToDo (str) {
        return str.indexOf('rmi-highlight-task ') >0
    }

}
export default new Highlighter()

function replaceTodo(match, inner, offset) {
    if (inner === 'X' || inner === 'x') {
        return `<span data-rmli-type="taskDone" data-rmli-offset="${offset}" data-rmli-length="${match.length}"  class="rmi-highlight-task rmi-highlight-task-done"></span>`
    } else {
        return `<span data-rmli-type="taskOpen" data-rmli-offset="${offset}" data-rmli-length="${match.length}"  class="rmi-highlight-task rmi-highlight-task-open"></span>`
    }
}