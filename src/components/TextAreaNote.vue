
<template>
  <div :class="['rmli-note', {'rmli-focus': hasFocus}]" @click="$emit('click')">
      <textarea 
        :value="element.value" 
        @keydown="onKeyDown"
        row=1
        @keyup="onKeyUp" 
        @change="onChange"
        @blur="hasFocus = false"
        @focus="hasFocus = true"
        ref="input" />
  </div>
</template>

<style lang="scss">
  @import '../scss/note.scss';
</style>
<script>

export default {
  name: 'Note',
  emits: ['change', 'focus', 'click'],
  props: {
    element :{
      type: Object,
      default() {
        return { value: '' , placeholder:"Click to create new"}
      }
    },
  },
  data: function () {
    return {
        hasFocus:false
    }
  },
  components: {
  },
  methods: {
    onChange (e) {
      this.$emit('change', e.target.value)
    },
    onKeyUp () { 
      this.resize()
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
    resize () { 
      if (this.$refs.input) {
        console.debug('Resize')
        const input = this.$refs.input
        //input.style.height = input.scrollHeight - 4 + 'px';
        // input.style.height = "auto"
        input.style.height = (input.scrollHeight) + "px"
      }
    },
    focus () {
      this.$refs.input.focus()
    }
  },
  mounted () {
    this.resize()
  }
}
</script>
