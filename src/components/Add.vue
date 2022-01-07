
<template>
  <div :class="['rmli-note rmli-add', {'rmli-focus': hasFocus}]" @click="$emit('click')">
      <textarea
        v-model="value" 
        @keydown="onKeyDown" 
        @keyup="onKeyUp" 
        row=1
        @blur="onBlur" 
        @change="onChange"
        @focus="hasFocus = true"
        ref="input"
        :placeholder="placeholder"
    />
  </div>
</template>

<style lang="scss">
  @import '../scss/add.scss';
  @import '../scss/note.scss';
</style>
<script>

import Note from './Note.vue'

export default {
  name: 'Add',
  mixins:[Note],
  emits: ['change', 'click', 'add'],
  props: ['placeholder'],
  data: function () {
    return {
        hasFocus: false,
        value: ''
    }
  },
  components: {
  },
  methods: {
    onChange (e) {
        this.$emit('change', e.target.value)
    },
    onBlur (e) {
        if (this.value) {
            this.$emit('add', e.target.value)
        }
        this.value =''
        this.hasFocus = false
        const input = this.$refs.input
        // input.style.height = input.scrollHeight - 4 + 'px';
        input.style.height = "auto"
    }
  },
  mounted () {
  }
}
</script>
