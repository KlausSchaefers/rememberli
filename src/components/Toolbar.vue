<template>

  <div class="rmli-toolbar-wrapper">
    <span class="rmli-toolbar-menu rmli-action-link" @click="onMenu">
      <i class="ri-menu-line" v-if="!hasMenu"></i>
      <i class="ri-close-line" v-if="hasMenu"></i>
    </span>
     <nav class="rmli-container">    
          <div class="rmli-toolbar">
                <div class="rmli-tools">
                </div>
                <div :class="['rmli-search', {'rmli-search-attention': hasAttention}]">
                    <Combo :options="tagsAndPersons" :placeholder="$t('toolbar.search')" :placeholder2="$t('toolbar.search_hint')" v-model="search" @change="onSearch" @focus="onFocus" @blur="onBlur" ref="searchInput" />
                 
                    <i class="ri-close-line rmli-toolbar-reset" v-if="search !== ''" @click="reset"></i>
                    <i class="ri-search-line rmli-toolbar-search" v-else></i>
                </div>
        
          </div>
       </nav>
  </div>
</template>

<style lang="scss">
  @import '../scss/toolbar.scss';
</style>
<script>
import Combo from '../common/Combo.vue'

export default {
  name: 'Toolbar',
  emits: ['save', 'select', 'search', 'new', 'menu'],
  props: ['file', 'isDirty'],
  data: function () {
    return {
        search: '',
        hasMenu: false,
        hasCombo: true,
        hasAttention: false,
        hasFocus: false
    }
  },
  components: {
    Combo
  },
  inject: ['tagsAndPersons'],
  computed: {
  },
  methods: {
    onMenu () {
      this.hasMenu = !this.hasMenu
      this.$emit('menu', this.hasMenu)
    },
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
    },
    reset () {
      this.search = ''
      this.$emit('search', this.search)
    },
    focus () {
      if (this.$refs.searchInput) {
        this.$refs.searchInput.focus()
      }
    },
    onFocus () {
      this.hasFocus = true
    },
    onBlur () {
      this.hasFocus = false
    },
    setSearch (search) {
      this.search = search
      this.hasAttention = true
      this.onSearch()
      setTimeout(() => this.hasAttention = false, 300)
    }
  },
  mounted () {
  }
}
</script>
