
<template>
  <div :class="['rmli-note', {'rmli-focus': hasFocus}]" @click="$emit('click')">
      <div class="rmli-note-status">
          {{created}} 
          <i class="ri-pushpin-2-line" v-if="!isPinned" @click="onPinned(true)"></i>
          <i class="ri-pushpin-2-fill" v-if="isPinned" @click="onPinned(false)"></i>
      </div>
      <div class="rmli-placeholder-container">
        <span class="rmli-placeholder" v-if="hasPlaceHolder" @click="onPlaceHolderClick"> {{placeholder}} </span> 
        <div 
          :class="['rmli-editable', { 'rmli-editable-placeholder': hasPlaceHolder}]" 
          contenteditable="true" 
          ref="input"
          @focus="onFocus"
          @paste="onPaste"
          @keydown="onKeyDown"
          @keyup="onKeyUp"
          @blur="onBlur"/>
      </div>

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
import * as Highlighter from '../util/Highlighter'


export default {
  name: 'Note',
  emits: ['change', 'focus', 'click', 'pinned'],
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
        hasPlaceHolder: false,
        value: ''
    }
  },
  components: {
  },
  computed: {
      isPinned () {
        return this.element.pinned
      },
      created () {
        // hack to make ui update
        this.setValue(this.element.value)
        if (this.element.created) {
          return dayjs(this.element.created).fromNow()
        }
        return ''
      },
      lastUpdate () {
        // hack to make ui update
        this.setValue(this.element.value)
        if (this.element.lastUpdate) {
          return dayjs(this.element.lastUpdate).fromNow()
        }
        return ''
      }
  },
  methods: {
    onPaste (e) {
      Logger.log(3, 'Note.onPaste() > enter')
      let text = e.clipboardData.getData('text')
      if (text) {
        e.preventDefault()
        this.insertAtCursor(text)
      }
    },
    onPinned (v) {
      Logger.log(-3, 'Note.onPinned() ', v)
      this.$emit('pinned', v)
    },
    onFocus () {
      this.hasFocus = true
      this.setValue(this.element.value)
    },
    onBlur () {
      Logger.log(3, 'Note.onBlur() ', this.getValue(), `>${this.getText()}<`)
      if (this.hasPlaceHolder) {
        this.$emit('change', '')
      } else {
        this.$emit('change', this.getValue())
      }
      this.hasFocus = false
      this.setValue(this.element.value)
    },
    onKeyUp () {
        let value = this.getText()
        this.value = value
        this.hasPlaceHolder = value === ''
    },
    onKeyDown (e) {
      if (e.key == 'Tab') {
        e.preventDefault();
        this.insertAtCursor("\t")
      }
    },
    insertAtCursor(text) {
        if (this.$refs.input) {
          var editor = this.$refs.input
          var doc = editor.ownerDocument.defaultView;
          var sel = doc.getSelection();
          var range = sel.getRangeAt(0);
          var tabNode = document.createTextNode(text);
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
            return this.$refs.input.innerText.trim()
        }
        return ''
    },
    setValue (value) {
        if (this.$refs.input) {
          if (!this.hasFocus) {
            this.$refs.input.innerHTML = Highlighter.highlight(value)
          } else {
            this.$refs.input.innerHTML = value
          }
        }
        this.$nextTick(() => {
          this.value = this.getText()
        })
    },
    onPlaceHolderClick () {
      this.focus()
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
