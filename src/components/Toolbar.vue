<template>
  <div class="rmli-toolbar">
    <div class="rmli-tools">
          <button @click="onNew">
              <i class="ri-file-add-line" ></i> 
              <span>{{$t('toolbar.new')}}</span>
          </button>
          <button @click="onSave">
              <i class="ri-save-line" ></i> 
              <span>{{$t('toolbar.save')}}</span>
              <span v-if="isDirty">*</span>
          </button>
          <button @click="onSelect">
              <i class="ri-folder-line"></i>
              <span>{{$t('toolbar.select')}}</span>
          </button>
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
  emits: ['save', 'select', 'search', 'new'],
  props: ['file', 'isDirty'],
  data: function () {
    return {
        search: ''
    }
  },
  components: {
  },
  methods: {
    onNew () {
      this.$emit('new')
    },
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
