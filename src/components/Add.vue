
<template>
  <div :class="['rmli-note rmli-add', {'rmli-focus': hasFocus}, {'rmli-timeline-note': settings.hasTimeline}, 'rmli-add-animation-' + animationStep]" @click="$emit('click')">
    <div class="rmli-placeholder-container">
        <span class="rmli-placeholder" v-if="hasPlaceHolder"  @click="onPlaceHolderClick"> {{placeholder}} </span> 
        <div 
            :class="['rmli-editable', { 'rmli-editable-placeholder': hasPlaceHolder}]" 
            contenteditable="true" 
            ref="input"
            @paste="onPaste"
            @input="update"
            @keydown="onKeyDown"
            @keyup="onKeyUp"
            @focus="hasFocus = true" 
            @blur="onBlur"/>
    </div>
  </div>
  <TypeAhead ref="typehead" v-if="hasFocus" @select="onTypeAhead"/>
</template>

<style lang="scss">
  @import '../scss/add.scss';
  @import '../scss/note.scss';
</style>
<script>

import Note from './Note.vue'
import Logger from '../util/Logger'

export default {
  name: 'Add',
  mixins:[Note],
  emits: ['change', 'click', 'add'],
  props: ['placeholder'],
  data: function () {
    return {
      animationStep: 'none'
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    onClick () {
       this.focus()
    },
    onChange (e) {
        this.$emit('change', e.target.value)
    },
    onBlur () {
        Logger.log(1, 'Add.onBlur()', this.getValue(), `>${this.getText()}<`)
        let text = this.getText()
        this.hasFocus = false
        if (text) {
            this.$emit('add', this.getValue())
            this.animationStep = 'hidden'
            setTimeout(() => {
              this.animationStep = 'grow'
            }, 500)
            setTimeout(() => {
              this.animationStep = 'none'
            }, 1500)
        }
        this.reset()
    },
    reset () {
        // make somehow invisible and then popin again...
        this.setInnerHTML('')
        this.hasPlaceHolder = true
      
    },
    setInnerHTML (html) {
      if (this.$refs.input) {
        this.$refs.input.innerHTML = html
      } else {
        Logger.log(3, 'Add.setInnerHTML() > No input')
      }
    },
  },
  mounted () {
      this.reset()
  }
}
</script>
