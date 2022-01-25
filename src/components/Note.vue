
<template>
  <div 
    :class="[
      'rmli-note ', 
      {'rmli-focus': hasFocus}, 
      {'rmli-due': isDue}, 
      {'rmli-todo': isTodoQuery}, 
      {'rmli-pinned': isPinned}, 
      {'rmli-timeline-note': settings.hasTimeline}
    ]" 
    @click="$emit('click')" 
    >
      <div 
        :class="[
            'rmli-note-status', 
            {'rmli-element-border': settings.hasBorderTop}, 
            {'rmli-note-date-left': settings.hasDateLeft}
          ]"
          :data-element-id="element.id"  
          @dragstart="onDragStart"
          :draggable="isDragable"
      >
            <div class="rmli-timeline-note-knop" v-if="settings.hasTimeline"/>
            <div class="rmli-note-status-dates" > 
              ToDo: {{isTodoQuery}}
             
                <div :class="['rmli-note-status-due-message',{'rmli-due': isDue}]" v-if="isAlarmSet"  @mousedown="onAlarm(true)">
                  <i class="ri-alarm-line"></i>{{printDate(element.due)}}
                </div>
                <span v-else/>
                {{created}}    
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
      <div class="rmli-placeholder-container" v-show="!isTodoQuery | hasFocus">
        <span class="rmli-placeholder" v-if="hasPlaceHolder" @click="onPlaceHolderClick"> {{placeholder}} </span> 
        <div 
          :class="['rmli-editable', { 'rmli-editable-placeholder': hasPlaceHolder}]" 
          contenteditable="true" 
          ref="input"
          @mousedown="onMouseDown"
          @focus="onFocus"
          @paste="onPaste"
          @keydown="onKeyDown"
          @keyup="onKeyUp"
          @blur="onBlur"/>
      </div>
      <div v-if="isTodoQuery && !hasFocus" @click="focus">
         <div :class="['rmli-editable']" v-html="todosText" />
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
import DropDown from '../common/DropDown.vue'
import * as Util from '../util/Util'
import * as RememberLi from '../services/RememberLi'


export default {
  name: 'Note',
  emits: ['change', 'focus', 'click', 'pinned', 'alarm', 'delete', 'folder', 'search', 'hint'],
  props: {
    isTodoQuery: {
      type: Boolean,
      default: false
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
        value: ''
    }
  },
  components: {
    DropDown
  },
  computed: {
      todosText () {
        if (this.isTodoQuery) {
          let text = this.element.value
          let result = text.split('\n').filter(line => {        
            return RememberLi.matchesToDo(line) || RememberLi.isTodoQuery(line)
          }).join('\n')     
          return Highlighter.highlight(result, this.query)
        }
        return ''
      },
      isDragable () {
        return !this.hasFocus
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
          let age = (new Date().getTime() -this.element.created )
          if (age < 1000 * 24 * 60 * 60 ) {
            return dayjs(this.element.created).fromNow()
          } else {
            return this.printDate(this.element.created)
          }
          
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
    onMouseDown (e) {
      Logger.log(-3, 'Note.onMouseDown() > enter', e)
      if (e.target) {
        let type = e.target.getAttribute('data-rmli-type')
        switch (type) {
          case 'tag':
            this.setSearch(e)
            break
          case 'person':
            this.setSearch(e)
            break
          default:
            break
        }
      } 
    },
    setSearch (e) {
      const query = e.target.innerText
      if (e.metaKey) {
        Util.stopEvent(e)        
        Logger.log(-3, 'Note.setSearch() > enter', query)
        this.$emit('search', query)
      } else {
        this.$emit('hint', this.$t('note.metaKeyToSearch'))
      }
    },
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
      this.setValue(this.element.value)
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
      this.setValue(this.element.value)
    },
    onDelete () {
        this.$emit('change', '')
    },
    onMoveFolder () {
      this.$emit('folder', '')
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
        if (this.$refs.input) {
          if (!this.hasFocus) {
            this.$refs.input.innerHTML = Highlighter.highlight(value, this.query)
          } else {
            this.$refs.input.innerHTML = value
          }
        } else {
          Logger.log(3, 'Note.setValue() > No input')
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
