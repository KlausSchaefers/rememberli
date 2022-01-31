
import Highlighter from '../../src/util/Highlighter'

describe('Highlighter2', () => {

    it('test single', () => {      
      let html = Highlighter.highlight('Klaus []', 'klaus')
      console.debug(html)
      expect(html.indexOf('<span class="rmi-highlight-query">Klaus</span>')).toBeGreaterThanOrEqual(0)
      expect(html.indexOf('<span data-rmli-type="taskOpen" data-rmli-offset="6" data-rmli-length="2"  class="rmi-highlight-task rmi-highlight-task-open"></span>')).toBeGreaterThanOrEqual(0)
    })

    it('test multi', () => {      
      let html = Highlighter.highlight('Klaus was here', 'klaus here')
      console.debug(html)
      expect(html.indexOf('<span class="rmi-highlight-query">Klaus</span>')).toBeGreaterThanOrEqual(0)
      expect(html.indexOf('<span class="rmi-highlight-query">here</span>')).toBeGreaterThanOrEqual(0)
    })

    it('test evil', () => {      
      let html = Highlighter.highlight('Klaus []', 'taskOpen')
      console.debug(html)
      expect(html.indexOf('<span class="rmi-highlight-query">taskOpen</span>')).toBe(-1)
      expect(html.indexOf('<span data-rmli-type="taskOpen" data-rmli-offset="6" data-rmli-length="2"  class="rmi-highlight-task rmi-highlight-task-open"></span>')).toBeGreaterThanOrEqual(0)
    })

    it('test evil2', () => {      
      let html = Highlighter.highlight('taskOpen []', 'taskOpen')
      console.debug(html)
      expect(html.indexOf('<span class="rmi-highlight-query">taskOpen</span>')).toBe(0)
      expect(html.indexOf('<span data-rmli-type="taskOpen" data-rmli-offset="9" data-rmli-length="2"  class="rmi-highlight-task rmi-highlight-task-open"></span>')).toBeGreaterThanOrEqual(0)
    })

    
  })

  

  function Xit () {

  }