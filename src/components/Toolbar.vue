<template>
  <div class="rmli-toolbar">
    <button @click="save">Save <span v-if="isDirty">*</span></button>
    <button @click="select">Select</button>
  </div>
</template>

<script>

export default {
  name: 'Toolbar',
  emits: ['save', 'select'],
  props: ['file', 'isDirty'],
  data: function () {
    return {
    }
  },
  components: {
  },
  methods: {
    save () {
        this.$emit('save')
    },
    select () {
     this.$emit('select')
    }
  },
  mounted () {
      console.debug('Toolbar', this.isDirty)
  }
}
</script>
