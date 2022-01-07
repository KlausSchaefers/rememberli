
<template>
  <div class="rmli-note" @click="$emit('click')">
      <textarea :value="element.value" @keydown="onKeyDown" @keyup="onKeyPress" ref="input" :placeholder="element.placeholder"/>
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
        value: ''
    }
  },
  components: {
  },
  methods: {
    onKeyPress (e) {
      console.debug('onKeyPress', e.target.value)
      this.$emit('change', e.target.value)
    },
    onKeyDown () {
      //console.debug('onKeyDown()', this.value, e)
    
     
     /*
      if (e.key == 'Tab') {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        this.value = this.value.substring(0, start) +
          "\t" + this.value.substring(end);

        // put caret at right position again
        this.selectionStart =
          this.selectionEnd = start + 1;
      }


      this.style.height = "auto";
      this.style.height = (this.scrollHeight) + "px";
      */

    },
    focus () {
      this.$refs.input.focus()
    }
  },
  mounted () {
    if (this.element) {
      this.value = this.element.value
    }
  }
}
</script>
