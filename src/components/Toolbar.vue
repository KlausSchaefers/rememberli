<template>
  <div class="rmli-toolbar">
    <div class="rmli-tools">
        <i class="ri-save-line" @click="onSave"></i> <span v-if="isDirty">*</span>
        <i class="ri-folder-line" @click="onSelect"></i>
    </div>
     <div class="rmli-search">
        <input v-model="search" :placeholder="$t('toolbar.search')" @keydown="onSearch">
        <i class="ri-search-line"></i>
    </div>
  </div>
</template>

<style lang="scss">
  @import '../scss/toolbar.scss';
</style>
<script>

export default {
  name: 'Toolbar',
  emits: ['save', 'select', 'search'],
  props: ['file', 'isDirty'],
  data: function () {
    return {
        search: ''
    }
  },
  components: {
  },
  methods: {
    onSave () {
        this.$emit('save')
    },
    onSelect () {
        this.$emit('select')
    },
    onSearch () {
        this.$emit('search', this.search)
    }
  },
  mounted () {
      console.debug('Toolbar', this.isDirty)
  }
}
</script>
