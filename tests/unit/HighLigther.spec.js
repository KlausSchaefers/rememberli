
import Highlighter from '../../src/util/Highlighter'

describe('Highlighter.js', () => {
    Xit('test hightlight (regex)', () => {      
      let html = Highlighter.highlight('klaus was #here @person\n - [] Open task 1\n - [x] Done task 2\n\n -> Arrow\n #tag2')
      expect(html.indexOf('<span data-rmli-type="tag" class="rmi-highlight-tag">#here</span>')).toBeGreaterThan(-1)
      expect(html.indexOf('<span data-rmli-type="tag" class="rmi-highlight-tag">#tag2</span>')).toBeGreaterThan(-1)
      expect(html.indexOf('<span data-rmli-type="person" class="rmi-highlight-person">@person')).toBeGreaterThan(-1)
      expect(html.indexOf('<span data-rmli-type="taskOpen" data-rmli-offset="27" data-rmli-length="2"  class="rmi-highlight-task rmi-highlight-task-open"></span>')).toBeGreaterThan(-1)
      expect(html.indexOf('<span data-rmli-type="taskDone" data-rmli-offset="45" data-rmli-length="3"  class="rmi-highlight-task rmi-highlight-task-done"></span>')).toBeGreaterThan(-1)
      expect(html.indexOf('<i class="ri-arrow-right-line rmi-highlight-icon"></i>')).toBeGreaterThan(-1)
    })

    Xit('test hightlight todo (regex)', () => {
      
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

    Xit('bug hightlight mixed todo (regex)', () => {
      let html = Highlighter.highlight('Above\n[ ] abc []\n[X] def [x]') 
      expect(html.indexOf('<span data-rmli-type="taskOpen" data-rmli-offset="6" data-rmli-length="3"  class="rmi-highlight-task rmi-highlight-task-open">')).toBeGreaterThan(-1)
      expect(html.indexOf('<span data-rmli-type="taskOpen" data-rmli-offset="14" data-rmli-length="2"  class="rmi-highlight-task rmi-highlight-task-open">')).toBeGreaterThan(-1)
      expect(html.indexOf('<span data-rmli-type="taskDone" data-rmli-offset="17" data-rmli-length="3"  class="rmi-highlight-task rmi-highlight-task-done">')).toBeGreaterThan(-1)
      expect(html.indexOf('<span data-rmli-type="taskDone" data-rmli-offset="25" data-rmli-length="3"  class="rmi-highlight-task rmi-highlight-task-done">')).toBeGreaterThan(-1)

    })

    it('performance hightlight (regex)', () => {
      
      let max = 20000
      let texts = []
      for (let i = 0; i < max; i++) {
        texts.push(getRandomString(i))
      }

      console.time('performance hightlight (regex)')
      for (let i = 0; i < max; i++) {
        Highlighter.highlight(texts[i])
      }
      console.timeEnd('performance hightlight (regex)')
    })


    Xit('test hightlight (fast)', () => {      
      let html = Highlighter.highlightFast('klaus was #here @person\n - [] Open task 1\n - [x] Done task 2\n\n -> Arrow\n #tag2')
      //console.debug(html)
      expect(html.indexOf('<span data-rmli-type="tag" class="rmi-highlight-tag">#here</span>')).toBeGreaterThan(-1)
      expect(html.indexOf('<span data-rmli-type="tag" class="rmi-highlight-tag">#tag2</span>')).toBeGreaterThan(-1)
      expect(html.indexOf('<span data-rmli-type="person" class="rmi-highlight-person">@person')).toBeGreaterThan(-1)
      expect(html.indexOf('<span data-rmli-type="taskOpen" data-rmli-offset="27" data-rmli-length="2"  class="rmi-highlight-task rmi-highlight-task-open"></span>')).toBeGreaterThan(-1)
      expect(html.indexOf('<span data-rmli-type="taskDone" data-rmli-offset="45" data-rmli-length="3"  class="rmi-highlight-task rmi-highlight-task-done"></span>')).toBeGreaterThan(-1)
      expect(html.indexOf('<i class="ri-arrow-right-line rmi-highlight-icon"></i>')).toBeGreaterThan(-1)
    })

    Xit('bug hightlight mixed todo (fast)', () => {
      let html = Highlighter.highlightFast('Above\n[ ] abc []\n[X] def [x]')
      console.debug(html)

      expect(html.indexOf('<span data-rmli-type="taskOpen" data-rmli-offset="6" data-rmli-length="3"  class="rmi-highlight-task rmi-highlight-task-open">')).toBeGreaterThan(-1)
      expect(html.indexOf('<span data-rmli-type="taskOpen" data-rmli-offset="14" data-rmli-length="2"  class="rmi-highlight-task rmi-highlight-task-open">')).toBeGreaterThan(-1)
      expect(html.indexOf('<span data-rmli-type="taskDone" data-rmli-offset="17" data-rmli-length="3"  class="rmi-highlight-task rmi-highlight-task-done">')).toBeGreaterThan(-1)
      expect(html.indexOf('<span data-rmli-type="taskDone" data-rmli-offset="25" data-rmli-length="3"  class="rmi-highlight-task rmi-highlight-task-done">')).toBeGreaterThan(-1)
      expect(html.indexOf('  abc ')).toBe(-1)
    })

    Xit('test hightlight todo (fast)', () => {
      
      let html = Highlighter.highlightFast('[]')
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

    it('performance hightlight (fast)', () => {
      
   
      let max = 20000
      let texts = []
      for (let i = 0; i < max; i++) {
        texts.push(getRandomString(i))
      }

      console.time('performance hightlight (fast)')
      for (let i = 0; i < max; i++) {
        Highlighter.highlight(texts[i])
      }
      console.timeEnd('performance hightlight (fast)')
    })


    
  })

  function getRandomString (i) {

    let text = `klaus was #here${i} @person${i+1}\n - [] Open task ${i + 2}\n- [ ] Open task ${i + 6}\n- [X] Open task ${i + 7}\n - [x] Done task ${i + 4}\n\n -> Arrow ${i + 5}\n`
    let result = ''
    for (let j=0; j < 100; j++) {
      result += text
    }
    return result
  }
  

  function Xit () {

  }