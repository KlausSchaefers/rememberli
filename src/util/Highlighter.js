
import * as RememberLi from '../services/RememberLi'

const breakChars = {' ':true, '\n': true, '.': true, ',': true, '!': true, "?": true, '\\': true, '/': true}

class Highlighter {

    highlight (html, query){
        /**
         * Replace all the task first, because we need the position in the string. If
         * replace the tags or so, before the markup will change the positions
         */
        let result = this.replaceTasksDiv(html)      
        result = result.replace(/(#[a-zA-Z0-9\-_&]+)/g,'<span data-rmli-type="tag" class="rmi-highlight-tag">$1</span>')
        result = result.replace(/(@[a-zA-Z0-9\-_&]+)/g,'<span data-rmli-type="person" class="rmi-highlight-person">$1</span>')    
        result = this.replaceAll(result, '->','<i class="ri-arrow-right-line rmi-highlight-icon"></i>')
       
        /**
         * Replace query if needed
         */
        result = this.hightlightQuery(result, query)
        return result
    }

    hightlightQuery (result, query) {
        if (query) {
            let parsed = RememberLi.parseQuery(query)
            parsed.terms.forEach(term => {
                var reg = "(" + term + ")(?![^<]*>|[^<>]*</)"; 
                var regExp = new RegExp(reg, 'gi');
                result = result.replace(regExp, '<span class="rmi-highlight-query">$1</span>')
            })  
        }
        return result
    }

    highlightFast (html, query) {
        const l = html.length;
        const end = l - 1
        let result = ''
        let word = ''
        let wordStart = 0
        for (let i = 0; i < l; i++) {
            let char = html[i]
            if (!breakChars[char] && i < end) {
                word += char
            } else {     

                /** we could hve something like a */

                if (i == end) {
                    word += char
                    char = ''
                }
         
                
                if (word[0] === '#') {
                    word = '<span data-rmli-type="tag" class="rmi-highlight-tag">' + word + '</span>'
                }
                if (word[0] === '@') {
                    word = '<span data-rmli-type="person" class="rmi-highlight-person">' + word + '</span>'
                }
                if (word === '->') {
                    word = '<i class="ri-arrow-right-line rmi-highlight-icon"></i>'
                }

                if (word === '[]') {
                    word = '<span data-rmli-type="taskOpen" data-rmli-offset="' + wordStart + '" data-rmli-length="2"  class="rmi-highlight-task rmi-highlight-task-open"></span>'
                }               

                if (word === '[x]' || word === '[X]') {
                    word = '<span data-rmli-type="taskDone" data-rmli-offset="' + wordStart + '" data-rmli-length="3"  class="rmi-highlight-task rmi-highlight-task-done"></span>'
                }

                if (word === '[' && html[i + 1] === ']') {
                    word = '<span data-rmli-type="taskOpen" data-rmli-offset="' + wordStart + '" data-rmli-length="3"  class="rmi-highlight-task rmi-highlight-task-open"></span>'
                    i = i + 1
                } 

                result += word + char
                word = ''
                wordStart = i + 1


                while (breakChars[html[i+1]]) {
                    result += breakChars[html[i+1]]
                    i++
                }
            }    
        }
 

        if (query) {
            var regExp = new RegExp('(' + query + ')', 'gi');
            result = result.replace(regExp, '<span class="rmi-highlight-query">$1</span>')
        }
        
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