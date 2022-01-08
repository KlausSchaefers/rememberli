
<template>
  <div :class="['rmli-note', {'rmli-focus': hasFocus}]" @click="$emit('click')">
      <div class="rmli-note-status">
       {{lastUpdate}}
      </div>
      <div 
        :class="['rmli-editable', { 'rmli-editable-placeholder': hasPlaceHolder}]" 
        contenteditable="true" 
        ref="input"
        @keydown="onKeyDown"
        @keyup="onKeyUp"
        @focus="hasFocus = true" 
        @blur="onBlur"/>

 
  </div>
</template>

<style lang="scss">
  @import '../scss/note.scss';
</style>
<script>

import Logger from '../util/Logger'
import dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import * as Util from '../util/Util'


export default {
  name: 'Note',
  emits: ['change', 'focus', 'click'],
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    element :{
      type: Object,
      default() {
        return { value: ''}
      }
    },
  },
  data: function () {
    return {
        hasFocus:false,
        value: ''
    }
  },
  components: {
  },
  computed: {
      hasPlaceHolder () {
          return this.getText() === this.placeholder
      },
      lastUpdate () {
        // hack to make ui update
        this.setValue(this.element.value)
        if (this.element.lastUpdate) {
          return dayjs(this.element.lastUpdate).fromNow()
          //return new Date(this.element.lastUpdate).toLocaleDateString()
        }
        return ''
      }
  },
  methods: {
    onBlur () {
      Logger.log(3, 'Note.onBlur() ', this.getValue().re)
      if (this.hasPlaceHolder) {
        this.$emit('change', '')
      } else {
        this.$emit('change', this.getValue())
      }
      
      this.hasFocus = false
    },
    onKeyUp () {
        let value = this.getValue().trim()
        if (value === '') {
          this.setValue(this.placeholder)
        }
    },
    onKeyDown (e) {
      if (e.key == 'Tab') {
        e.preventDefault();
        this.insertCharAtCursor("\t")
      }
    },
    insertCharAtCursor(character) {
        if (this.$refs.input) {
          var editor = this.$refs.input
          var doc = editor.ownerDocument.defaultView;
          var sel = doc.getSelection();
          var range = sel.getRangeAt(0);
          var tabNode = document.createTextNode(character);
          range.insertNode(tabNode);
          range.setStartAfter(tabNode);
          range.setEndAfter(tabNode); 
          sel.removeAllRanges();
          sel.addRange(range);
        }
    },
    getValue () {
        if (this.$refs.input) {
            return this.$refs.input.innerHTML
        }
        return ''
    },
    getText () {
        if (this.$refs.input) {
            return this.$refs.input.innerText
        }
        return ''
    },
    setValue (value) {
        if (this.$refs.input) {
          this.$refs.input.innerHTML = Util.replaceAllowedTags(value);
        }
    },
    focus () {
      this.$refs.input.focus()
    }
  },
  mounted () {
     if (this.element && this.element.value != undefined) {
        this.setValue(this.element.value)
    }
  }
}
</script>
