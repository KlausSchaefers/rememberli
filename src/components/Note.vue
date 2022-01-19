
<template>
  <div 
    :class="['rmli-note ', {'rmli-focus': hasFocus}, {'rmli-due': isDue}, {'rmli-pinned': isPinned}]" 
    @click="$emit('click')" 
    :data-element-id="element.id"  
    @dragstart="onDragStart"
    :draggable="isDragable"
    >
      <div class="rmli-note-status rmli-element-border">
          {{created}}
          <i class="ri-pushpin-2-line rmli-pinned" v-if="settings.hasPinning && (!isPinned && !hasMore)" @click="onPinned(true)"></i>
          <i class="ri-pushpin-2-fill rmli-pinned rmli-note-icon-active" v-if="isPinned" @click="onPinned(false)"></i>

          <i class="ri-alarm-line" v-if="!isAlarmSet && !hasMore" @click="onAlarm(true)"></i>
          
            <i :class="['ri-alarm-fill rmli-tooltip rmli-note-icon-active', {'rmli-due': isDue}]"  v-if="isAlarmSet" @click="onAlarm(false)">
              <span class="rmli-tooltip-message"> {{$t('note.due')}} {{printDate(element.due)}}</span>
            </i>
      
          <i class="ri-more-line rmli-note-more" v-if="hasMore"></i>
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
  @import '../scss/tooltip.scss';
</style>
<script>

import Logger from '../util/Logger'
import dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import * as Highlighter from '../util/Highlighter'


export default {
  name: 'Note',
  emits: ['change', 'focus', 'click', 'pinned', 'alarm'],
  props: {
    hasMenu: {
      type: Boolean,
      default: false
    },
    query: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    settings: {
      type: Object,
      default () {
        return {}
      }
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
        hasMore: false,
        hasFocus:false,
        hasPlaceHolder: false,
        value: ''
    }
  },
  components: {
  },
  computed: {
      isDragable () {
        return true // FIMXE: this.hasMenu
      },
      isDue () {
        return this.element.due > 0 && this.element.due < new Date().getTime()
      },
      isAlarmSet () {
        return this.element.due > 0
      },
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
    onDragStart (e) {
        Logger.log(-3, 'Note.onDragStart() > enter', e)
        e.dataTransfer.setData("text/plain", this.element.id);
        this.isDnd = true
    },
    onPaste (e) {
      Logger.log(3, 'Note.onPaste() > enter')
      let text = e.clipboardData.getData('text')
      if (text) {
        e.preventDefault()
        this.insertAtCursor(text)
      }
    },
    onAlarm (v) {
      Logger.log(-3, 'Note.onAlarm() ', v)
      this.$emit('alarm', v)
    },
    onPinned (v) {
      Logger.log(-3, 'Note.onPinned() ', v)
      this.$emit('pinned', v)
    },
    onFocus () {
      this.hasFocus = true
      this.isDnd = false
      this.setValue(this.element.value)
    },
    onBlur () {
      Logger.log(3, 'Note.onBlur() ', this.getValue(), `>${this.getText()}<`)
      if (this.isDnd) {
        Logger.log(3, 'Note.onBlur() > blue after DNN')
        return
      }
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
            this.$refs.input.innerHTML = Highlighter.highlight(value, this.query)
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
    },
    printDate (ts) {
      return new Date(ts).toLocaleDateString()
    }
  },
  mounted () {
     if (this.element && this.element.value != undefined) {
        this.setValue(this.element.value)
    }
  }
}
</script>
