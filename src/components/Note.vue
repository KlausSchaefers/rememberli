
<template>
  <div :class="['rmli-note', {'rmli-focus': hasFocus}]" @click="$emit('click')">
      <div class="rmli-note-status">
       {{lastUpdate}}
      </div>
      <div 
        :class="['rmli-editable', { 'rmli-editable-placeholder': hasPlaceHolder}]" 
        contenteditable="true" 
        ref="input"
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

export default {
  name: 'Note',
  emits: ['change', 'focus', 'click'],
  props: {
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
          return this.value === this.$t('note.remove')
      },
      lastUpdate () {
        // hack to make ui update
        this.setValue(this.element.value)
        if (this.element.lastUpdate) {
          return new Date(this.element.lastUpdate).toLocaleDateString()
        }
        return ''
      }
  },
  methods: {
    onBlur () {
      Logger.log(3, 'Note.onBlur() ', this.getValue())
      if (this.hasPlaceHolder) {
        this.$emit('change', '')
      } else {
        this.$emit('change', this.getValue())
      }
      
      this.hasFocus = false
    },
    onKeyUp () {
        this.value = this.getValue()
        if (this.value === '') {
          this.setValue(this.$t('note.remove'))
        }
    },
    onKeyDown (e) {
      //console.debug('onKeyDown()', e)
      if (e.key == 'Tab') {
        e.preventDefault();
        this.addTab()
      }
    },
    addTab() {
        if (this.$refs.input) {
            console.debug('addTab')
            let input = this.$refs.input
            var start = input.selectionStart
            var end = input.selectionEnd
            input.value = input.value.substring(0, start) +  "\t" + input.value.substring(end);
            input.selectionStart = 
            input.selectionEnd = start + 1;
        }
    },
    getValue () {
        if (this.$refs.input) {
           return this.$refs.input.innerText
        }
        return ''
    },
    setValue (value) {
        if (this.$refs.input) {
          this.$refs.input.innerText = value;
        }
        this.value = value
    },
    focus () {
      this.$refs.input.focus()
    }
  },
  watch: {
      // whenever question changes, this function will run
      element(newValue, oldValue) {
        console.debug('watch', newValue, oldValue)
      }
  },
  mounted () {
     if (this.element && this.element.value != undefined) {
        this.setValue(this.element.value)
    }
  }
}
</script>
