
<template>
  <div class="rmli-add rmli-note" @click="$emit('click')">
      <textarea
        v-model="value" 
        @keydown="onKeyDown" 
        @keyup="onKeyPress" 
        @blur="onBlur" 
        :placeholder="placeholder"
    />
  </div>
</template>

<style lang="scss">
  @import '../scss/add.scss';
  @import '../scss/note.scss';
</style>
<script>

export default {
  name: 'Add',
  emits: ['change', 'click', 'add'],
  props: ['placeholder'],
  data: function () {
    return {
        value: ''
    }
  },
  components: {
  },
  methods: {
    onKeyPress (e) {
        this.$emit('change', e.target.value)
    },
    onBlur (e) {
        if (this.value) {
            this.$emit('add', e.target.value)
        }
        this.value =''
    }
  },
  mounted () {
  }
}
</script>
