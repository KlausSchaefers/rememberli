
import Highlighter from '../../src/util/Highlighter'

describe('Highlighter.js', () => {
    it('test hightlight (all)', () => {      
      let html = Highlighter.highlight('klaus was #here @person\n - [] Open task 1\n - [x] Done task 2\n\n -> Arrow')
      expect(html.indexOf('<span data-rmli-type="person" class="rmi-highlight-tag">#here</span>')).toBeGreaterThan(-1)
      expect(html.indexOf('<span data-rmli-type="person" class="rmi-highlight-tag">')).toBeGreaterThan(-1)
      expect(html.indexOf('<span data-rmli-type="taskOpen" data-rmli-offset="27" data-rmli-length="2"  class="rmi-highlight-task rmi-highlight-task-open"></span>')).toBeGreaterThan(-1)
      expect(html.indexOf('<span data-rmli-type="taskDone" data-rmli-offset="45" data-rmli-length="3"  class="rmi-highlight-task rmi-highlight-task-done"></span>')).toBeGreaterThan(-1)
      expect(html.indexOf('<i class="ri-arrow-right-line rmi-highlight-icon"></i>')).toBeGreaterThan(-1)
    })

    it('test hightlight (todo)', () => {
      
      let html = Highlighter.highlight('[]')
      expect(html.indexOf('<span data-rmli-type="taskOpen" data-rmli-offset="0" data-rmli-length="2"  class="rmi-highlight-task rmi-highlight-task-open"></span>')).toBeGreaterThan(-1)
    
      html = Highlighter.highlight(' - []')
      expect(html.indexOf('<span data-rmli-type="taskOpen" data-rmli-offset="3" data-rmli-length="2"  class="rmi-highlight-task rmi-highlight-task-open"></span>')).toBeGreaterThan(-1)
 
      html = Highlighter.highlight(' - [ ]')
      expect(html.indexOf('<span data-rmli-type="taskOpen" data-rmli-offset="3" data-rmli-length="3"  class="rmi-highlight-task rmi-highlight-task-open"></span>')).toBeGreaterThan(-1)
 
      html = Highlighter.highlight(' - [x]')
      expect(html.indexOf('<span data-rmli-type="taskDone" data-rmli-offset="3" data-rmli-length="3"  class="rmi-highlight-task rmi-highlight-task-done"></span>')).toBeGreaterThan(-1)
 
      html = Highlighter.highlight(' - [X]')
      expect(html.indexOf('<span data-rmli-type="taskDone" data-rmli-offset="3" data-rmli-length="3"  class="rmi-highlight-task rmi-highlight-task-done"></span>')).toBeGreaterThan(-1)
 
    })

    it('bug hightlight (todo mixed)', () => {
      let html = Highlighter.highlight('Above\n[ ] abc []\n[X] def [x]')

      expect(html.indexOf('<span data-rmli-type="taskOpen" data-rmli-offset="6" data-rmli-length="3"  class="rmi-highlight-task rmi-highlight-task-open">') > -1)
      expect(html.indexOf('<span data-rmli-type="taskOpen" data-rmli-offset="14" data-rmli-length="2"  class="rmi-highlight-task rmi-highlight-task-open">') > -1)
      expect(html.indexOf('<span data-rmli-type="taskDone" data-rmli-offset="17" data-rmli-length="3"  class="rmi-highlight-task rmi-highlight-task-done">') > -1)
      expect(html.indexOf('<span data-rmli-type="taskDone" data-rmli-offset="25" data-rmli-length="3"  class="rmi-highlight-task rmi-highlight-task-done">') > -1)

    })

    

    
    it('performance hightlight (regex)', () => {
      
      console.time('performance hightlight (regex)')
      for (let i = 0; i < 10000; i++) {
        let html = Highlighter.highlight(getRandomString(i))
      }
      console.timeEnd('performance hightlight (regex)')
    })
    
  })

  function getRandomString (i) {

    let text = `klaus was #here${i} @person${i+1}\n - [] Open task ${i + 2}\n - [x] Done task ${i + 4}\n\n -> Arrow ${i + 5}\n`
    let result = ''
    for (let j=0; j < 100; j++) {
      result += text
    }
    return result
  }
  

  function Xit () {

  }