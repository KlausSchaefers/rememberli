
<template>
  <div 
    :class="[
      'rmli-note ', 
      {'rmli-focus': hasFocus}, 
      {'rmli-due': isDue}, 
      {'rmli-pinned': isPinned}, 
      {'rmli-note-todo' : isTodoQuery && !hasFocus},
      {'rmli-timeline-note': settings.hasTimeline}
    ]" 
    @click="$emit('click')" 
    >
      <div 
        :class="[
            'rmli-note-status', 
            {'rmli-element-border': settings.hasBorderTop}, 
            {'rmli-note-date-left': settings.hasDateLeft},
            {'rmli-note-sttus-hide-for-todo': settings.hideStatusForToDoView}
          ]"
          :data-element-id="element.id"  
          @dragstart="onDragStart"
          :draggable="isDragable"
      >
            <div class="rmli-timeline-note-knop" v-if="settings.hasTimeline"/>
            <div class="rmli-note-status-dates" > 
             
             
                <div :class="['rmli-note-status-due-message',{'rmli-due': isDue}]" v-if="isAlarmSet"  @mousedown="onAlarm(true)">
                  <i class="ri-alarm-line"></i>{{printDate(element.due)}}
                </div>
                <span v-else/>
                <span @dblclick="onCreate(true)">
                  {{$t('note.created')}}
                {{created}}
                </span>
            </div>

            <DropDown icon="ri-more-line"  class="rmli-note-more">
                <div class="rmli-dropdown-item" v-if="!isPinned" @mousedown="onPinned(true)">
                  <i class="ri-pushpin-2-line rmli-pinned" ></i> {{$t('note.pin')}}
                </div>
                <div class="rmli-dropdown-item" v-if="isPinned" @mousedown="onPinned(false)">
                  <i class="ri-pushpin-2-fill rmli-pinned"  ></i> {{$t('note.unpin')}}
                </div>
                <div class="rmli-dropdown-item" v-if="!isAlarmSet" @mousedown="onAlarm(true)">
                    <i class="ri-alarm-line"></i> {{$t('note.setreminder')}}
                </div>
                <div class="rmli-dropdown-item" v-if="isAlarmSet" @mousedown="onAlarm(false)">
                    <i class="ri-alarm-fill"></i> {{$t('note.changereminder')}}
                </div>     
                <div class="rmli-dropdown-item rmli-note-delete" @mousedown="onMoveFolder()">
                    <i class="ri-folder-transfer-line" v-if="element.folder"/>
                    <i class="ri-folder-add-line" v-else/>
                    {{ element.folder ? $t('note.changeFolder') : $t('note.addFolder')}}
                </div>    
                <div class="rmli-dropdown-item rmli-note-delete" @mousedown="onDelete()">
                    <i class="ri-delete-bin-7-line"></i> {{$t('note.delete')}}
                </div>        
            </DropDown>
  
           
      </div>
      <!-- must be show because otherwise ref might be not there on setValue() -->
      <div class="rmli-placeholder-container" v-if="!isTodoQuery | hasFocus">
        <span class="rmli-placeholder" v-if="hasPlaceHolder" @click="onPlaceHolderClick"> {{placeholder}} </span> 
        <div 
          :class="['rmli-editable', { 'rmli-editable-placeholder': hasPlaceHolder}]" 
          contenteditable="true" 
          ref="input"
          v-html="text"
          @mousedown="onMouseDown"
          @focus="onFocus"
          @paste="onPaste"
          @keydown="onKeyDown"
          @keyup="onKeyUp"
          @blur="onBlur"/>
      </div>
      <div v-if="isTodoQuery && !hasFocus" @click="focus">
         <div :class="['rmli-editable']" v-html="todosText" @mousedown="onMouseDown"/>
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
import Highlighter from '../util/Highlighter'
import DropDown from '../common/DropDown.vue'
import * as Util from '../util/Util'
import * as RememberLi from '../services/RememberLi'


export default {
  name: 'Note',
  emits: ['change', 'focus', 'click', 'pinned', 'alarm', 'delete', 'folder', 'search', 'hint', 'create'],
  props: {
    isTodoQuery: {
      type: Boolean,
      default: false
    },
    now: {
      type: Number,
      default: 0
    },
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
        hasMore: true,
        hasFocus:false,
        hasPlaceHolder: false,
        hasSetInnerHTML: false,
        value: ''
    }
  },
  components: {
    DropDown
  },
  computed: {
      text () {
        const value = this.element.value
        if (!this.hasFocus) {     
            if (
                this.settings.hasShrinkedSearch  && 
                RememberLi.isValidQuery(this.query) && 
                !RememberLi.isDueQuery(this.query) && 
                !RememberLi.isTodoQuery(this.query)
              ) {
               return this.getFocusedText(value)
            } else {
              return this.highlightedText
            }
        } else {
            return value
        }
      },
      highlightedText () {
        if (RememberLi.isValidQuery(this.query)) {
          return Highlighter.highlight(this.element.value, this.query)
        }
        return Highlighter.highlight(this.element.value)
      },
      todosText () {
        if (this.isTodoQuery) {
          let text = this.element.value
          text = Highlighter.highlight(text, this.query)
          let result = text.split('\n').filter(line => {     
            return Highlighter.matchesToDo(line) || RememberLi.isTodoQuery(line)
          }).map(line => {
            return line.trim()
          }).join('\n')     
          return result
        }
        return ''
      },
      isDragable () {
        return !this.hasFocus
      },
      isDue () {
        return this.element.due > 0 && this.element.due < this.now
      },
      isAlarmSet () {
        return this.element.due > 0
      },
      isPinned () {
        return this.element.pinned
      },
      created () {
        // hack to make ui update
        //this.setValue(this.element.value)
        if (this.element.created) {
          let age = (new Date().getTime() -this.element.created )
          if (age < 1000 * 24 * 60 * 60 ) {
            return dayjs(this.element.created).fromNow()
          } else {
            return this.printDate(this.element.created)
          }          
        }
        return ''
      }
  },
  methods: {
     getFocusedText (value) {     
       /**
        * First get the hits lines with a hit
        */
        let lines = value.toLowerCase().split('\n')
        let hits = new Set()
        let terms = RememberLi.parseQuery(this.query).terms
        lines.forEach((line, i) => {
          terms.forEach(term => {
            if (line.indexOf(term) > -1) {
              hits.add(i)
            }
          })       
        })

        /**
         * Render the highlights
         */
        let highlighted = Highlighter.highlight(value, this.query)
        let highlightedLines = highlighted.split('\n')

        /**
         * print out all hit lines and the ones above and below
         */
        let result = ''
        const printed = {}
        highlightedLines.forEach((line, i) => {
          if (hits.has(i)){

            let below = i - 1
            if (below >= 0 && !printed[below]) {
              result += `<span class="rmli-lowlight">${highlightedLines[below]}</span>\n`
              printed[below] = true
            }

            if (!printed[i]) {
              result += line + '\n'
              printed[i] = true
            }
    
            let above = i + 1          
            if (above < lines.length  && !printed[above]) {
              result += `<span class="rmli-lowlight">${highlightedLines[above]}</span>\n`
              printed[above] = true
            }         
          }                                          
        })

        return result
    },
    onMouseDown (e) {
      Logger.log(3, 'Note.onMouseDown() > enter', e)
      if (e.target) {
        let type = e.target.getAttribute('data-rmli-type')
        switch (type) {
          case 'tag':
            this.setSearch(e)
            break
          case 'person':
            this.setSearch(e)
            break
          case 'taskOpen':
            this.setTask(e, true)
            break
          case 'taskDone':
            this.setTask(e, false)
            break
          default:
            break
        }
      } 
    },
    hasMeta (e) {
      return e.metaKey || !this.settings.needMetaKeyForNoteAction
    },
    setTask (e, done) {
      Logger.log(3, 'Note.setTask() > enter', done)
      if (this.hasMeta(e)) {
        Util.stopEvent(e)
        const offset = e.target.getAttribute('data-rmli-offset') * 1
        const length = e.target.getAttribute('data-rmli-length') * 1 
        const value = this.element.value   
        const start = value.substring(0, offset)     
        const end = value.substring((offset + length), value.length)
        // console.debug(JSON.stringify({str: value}))
        // console.debug('setTask', value.length, offset, length, (offset + length))
        // console.debug('setTask', '>' + start + '<', '>' + end + '<')
        const newValue = start + (done ? '[x]' : '[]') + end     
        this.$emit('change', newValue)
      } else {
        this.$emit('hint', this.$t('note.metaKeyTask'))
      }

    },
    setSearch (e) {
      const query = e.target.innerText
      if (this.hasMeta(e)) {
        Util.stopEvent(e)        
        Logger.log(-3, 'Note.setSearch() > enter', query)
        this.$emit('search', query)
      } else {
        this.$emit('hint', this.$t('note.metaKeyToSearch'))
      }
    },
    onDragStart (e) {
        Logger.log(-3, 'Note.onDragStart() > enter', e)
        let data = {noteId: this.element.id}
        e.dataTransfer.setData("text/plain", JSON.stringify(data));
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
    onCreate () {
      Logger.log(-3, 'Note.onCreate() ')
      this.$emit('create')
    },
    onPinned (v) {
      Logger.log(-3, 'Note.onPinned() ', v)
      this.$emit('pinned', v)
    },
    focus () {
      Logger.log(-3, 'Note.focus() ')
      this.hasFocus = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    onFocus () {
      this.hasFocus = true
      this.isDnd = false
      //this.setValue(this.element.value)
    },
    onBlur () {
      Logger.log(3, 'Note.onBlur() ',`>${this.getText()}<`)
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
      //this.setValue(this.element.value)
    },
    onDelete () {
        this.$emit('change', '')
    },
    onMoveFolder () {
      this.$emit('folder', '')
    },
    onKeyUp () {
        let value = this.getText()
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
            // this is a hacky version, but seem to work.
            return Util.innerText(this.$refs.input)
            //return this.$refs.input.innerHTML
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
        //Logger.log(-3, 'Note.setValue() > enter', this.element.id)
        let html = value
        if (!this.hasFocus) {
          html = Highlighter.highlight(value, this.query)
        }
        if (this.hasSetInnerHTML) {
          this.setInnerHTML(html)
        }
    },
    setInnerHTML (html) {
      if (this.$refs.input) {
        this.$refs.input.innerHTML = html
      } else {
        Logger.log(3, 'Note.setInnerHTML() > No input')
      }
    },
    onPlaceHolderClick () {
      this.focus()
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
