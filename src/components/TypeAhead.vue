
<template>
  <div 
    :class="['rmli-type-ahead', {'rmli-type-ahead-visible': isVisible}]" 
    :style="'top :' + (caretPosition.top + 24) + 'px; left: ' + caretPosition.left + 'px' " 
   >
      <span
        v-for="(o) in matches"
        :key="o.label"
        :class="['rmli-type-ahead-item', {'rmli-type-ahead-item-selected': o.label === selected.value}]"
        @mousedown.stop.prevent="select(o, $event)"
      >
        {{ o.label }}
      </span>
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
  emits: ['change', 'focus', 'click', 'select'],
  props: {
  },
  data: function () {
    return {
        isOpen:false,
        caretPosition: {top: 0, left:0},
        text: '',
        selected: {
          value: false
        }
    }
  },
  computed: {
     hints() {
      return this.tagsAndPersons.map(o => {
        if (o.toLowerCase) {
          return {
            label: o,
            value: o
          }
        }
        return o
      })
    },
    matches () {
      return this.hints.filter(o => {
        return o.value.toLowerCase().indexOf(this.text) === 0
      })
    },
    isVisible () {
      return this.isOpen && this.matches.length > 0
    }
  },
  inject: ['tagsAndPersons'],
  components: {
  },
  methods: {
    onKeyDown (e) {
      Logger.log(3, 'TypeAhead.onKeyDown()', e.key, e)
      const key = e.key
      if (key === '@' || key === "#") {
          this.open()
      }

      if ('Backspace' === key) { // back
        this.text = this.text.substring(0, this.text.length-1)
        return
      }
     
      if ('ArrowDown' === key) { // Down
        e.preventDefault();
        let index = this.matches.findIndex(o => o.value === this.selected.value)
        if (index === -1) {
          this.selected = this.matches[0]
        } else {
          this.selected = this.matches[index + 1]
        }
        return
      }

      if ('ArrowUp' === key) { // UP
        e.preventDefault();
        let index = this.matches.findIndex(o => o.value === this.selected.value)
        if (index === -1) {
          this.selected = this.matches[0]
        } else {
          this.selected = this.matches[index - 1]
        }
        return
      }

      if ('Enter' === key) { // enter
        e.preventDefault();
        if (this.matches.length === 1) {
          this.select(this.matches[0])
        }
        if (this.selected.value) {
          this.select(this.selected)
        }
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
    select (o) {
      let value = o.value.substring(this.text.length)
      Logger.log(-1, 'TypeAhead.select()', value)
      this.$emit('select', value)
      this.close()
    },
    open() {
      Logger.log(-1, 'TypeAhead.open()')
      this.caretPosition = Util.getCaretTopPoint()
      this.isOpen = true
      this.text = ''
      this.selected = {
        value: false
      }
    },
    close () {
      Logger.log(-1, 'TypeAhead.close()')
      this.isOpen = false
      this.text = ''
      this.selected = {
        value: false
      }
    }
  },
  mounted () {
   
  }
}
</script>
