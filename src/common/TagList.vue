<template>
  <div class="rmli-tag-list" @click="focusInput">
    <span class="rmli-tag-list-item" v-for="(tag, index) in tags" :key="tag">
      {{tag}}
      <span class="rmli-tag-list-item-remove" @click.stop="removeTag(index)">&times;</span>
    </span>
    <input
      class="rmli-tag-list-input"
      type="text"
      ref="input"
      v-model="newTag"
      :placeholder="placeholder"
      @keydown="onKeyDown"
      @blur="addTag"
    />
  </div>
</template>
<style lang="scss">
    @use "../scss/taglist.scss";
</style>

<script>

export default {
  name: 'TagList',
  props: ['modelValue', 'placeholder'],
  emits: ['update:modelValue', 'change'],
  data: function () {
    return {
      newTag: ''
    }
  },
  computed: {
    tags () {
      return (this.modelValue || '').split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    }
  },
  methods: {
    focusInput () {
      this.$refs.input.focus()
    },
    onKeyDown (e) {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault()
        this.addTag()
        return
      }
      if (e.key === 'Backspace' && !this.newTag && this.tags.length > 0) {
        this.removeTag(this.tags.length - 1)
      }
    },
    addTag () {
      const value = this.newTag.trim()
      this.newTag = ''
      if (!value || this.tags.includes(value)) {
        return
      }
      this.emitTags([...this.tags, value])
    },
    removeTag (index) {
      this.emitTags(this.tags.filter((tag, i) => i !== index))
    },
    emitTags (tags) {
      const value = tags.join(',')
      this.$emit('update:modelValue', value)
      this.$emit('change', value)
    }
  }
}
</script>
