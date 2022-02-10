
<template>
  <div :class="['rmli-type-ahead', {'rmli-type-ahead-visible': isVisible}]" :style="'top :' + (caretPosition.top + 18) + 'px; left: ' + caretPosition.left + 'px' ">
    {{text}} {{tagsAndPersons.length}}
  </div>
</template>

<style lang="scss">
  @import '../scss/type-ahead.scss';
</style>
<script>
import Logger from '../util/Logger'
import * as Util from '../util/Util'

//const breakChars = {' ':true, '.': true, ',': true, ':': true, '!': true, "?": true, '/': true, 'Escape': true, 'ArrowLeft': true, 'ArrowRight': true}
const validTagRegex = /[a-zA-Z0-9\-_&]/

export default {
  name: 'TypeAhead',
  emits: ['change', 'focus', 'click'],
  props: {
  },
  data: function () {
    return {
        isVisible:false,
        caretPosition: {top: 0, left:0},
        text: ''
    }
  },
  inject: ['tagsAndPersons'],
  components: {
  },
  methods: {
    onKeyDown (e) {
      Logger.log(-1, 'TypeAhead.onKeyDown()', e.key, e)
      const key = e.key
      if (key === '@' || key === "#") {
          this.open()
      }
     
      if ('ArrowDown' === key) { // Down
        e.preventDefault();
        return
      }

      if ('ArrowUp' === key) { // UP
        e.preventDefault();
        return
      }

      if (!this.isValidTagChar(e)) {
        this.close()
      }

      this.text += e.key
     
      
      
    },
    isValidTagChar (e) {
      var char = String.fromCharCode(e.keyCode);
      if (validTagRegex.test(char)) {
        return true;
      }
      return false
    },
    open() {
      Logger.log(-1, 'TypeAhead.open()')
      this.caretPosition = Util.getCaretTopPoint()
      this.isVisible = true
      this.text = ''
    },
    close () {
      Logger.log(-1, 'TypeAhead.close()')
      this.isVisible = false
      this.text = ''
    }
  },
  mounted () {
   
  }
}
</script>
