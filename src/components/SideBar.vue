<template>
  <div :class="'rmli-sidebar rmli-sidebar-' + (hasMenu ? 'closed' : 'open') ">

    <div class="rmli-sidebar-content">
        <div class="rmli-sidebar-actions">
              <a @click="onNew">
                  <i class="ri-file-add-line" ></i> 
                  <span>{{$t('actions.new')}}</span>
              </a>
              <a @click="onSave" v-if="false">
                  <i class="ri-save-line" ></i> 
                  <span>{{$t('actions.save')}}</span>
                  <span v-if="isDirty">*</span>
              </a>
              <a @click="onSelect">
                  <i class="ri-folder-line"></i>
                  <span>{{$t('actions.select')}}</span>
              </a>
              <a @click="onExit">
                  <i class="ri-folder-line"></i>
                  <span>{{$t('actions.close')}}</span>
              </a>
        </div>

        <div class="rmli-sidebar-tags">
        
        </div>
    </div>
  
    
  </div>
</template>

<style lang="scss">
  @import '../scss/sidebar.scss';
</style>
<script>

export default {
  name: 'SideBar',
  emits: ['save', 'select', 'search', 'new', 'exit'],
  props: ['file', 'isDirty', 'hasMenu'],
  data: function () {
    return {
        isClosed: true,
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
    onExit () {
      this.$emit('exit')
    },
    onSearch () {
      this.$emit('search', this.search)
    }
  },
  mounted () {
  }
}
</script>
