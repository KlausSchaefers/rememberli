
<template>
  <div :class="['rmli-note rmli-add', {'rmli-focus': hasFocus}]" @click="$emit('click')">
      <div 
        :class="['rmli-editable', { 'rmli-editable-placeholder': hasPlaceHolder}]" 
        contenteditable="true" 
        ref="input"
        @click="onClick"
        @input="update"
        @keyup="onKeyUp"
        @focus="hasFocus = true" 
        @blur="onBlur"/>
  </div>
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
    }
  },
  components: {
  },
  computed: {
      hasPlaceHolder () {
          return  this.value === this.$t('add.start')
      }
  },
  methods: {
    onClick () {
        if (this.getValue() === this.$t('add.start')) {
            this.setValue('')
        }
    },
    onChange (e) {
        this.$emit('change', e.target.value)
    },
    onBlur () {
        Logger.log(-1, 'Add.onBlur()', this.getValue())
        let value = this.getValue()
        this.hasFocus = false
        if (value) {
            this.$emit('add', value)
        }
        this.reset()
    },
    reset () {
        // make somehow invisible and then popin again...
        this.setValue(this.$t('add.start'))
    }
  },
  mounted () {
      this.reset()
  }
}
</script>
