<template>

  <div class="rmli-toolbar-wrapper">
    <span class="rmli-toolbar-menu rmli-action-link" @click="onMenu">
      <i class="ri-menu-line" v-if="!open"></i>
      <i class="ri-close-line" v-if="open"></i>
    </span>
     <nav class="rmli-container">    
          <div class="rmli-toolbar">
                <div class="rmli-tools">                       
                </div>
                <div :class="['rmli-search', {'rmli-search-attention': hasAttention}]">
                    <Combo :options="tagsAndPersons" :placeholder="$t('toolbar.search')" :placeholder2="$t('toolbar.search_hint')" v-model="search" @change="onSearch" @focus="onFocus" @blur="onBlur" ref="searchInput" />
                 

                    <i :class="['rmli-toolbar-shrink rmli-tooltip', {'rmli-toolbar-shrink-active ri-filter-line' : hasShrinkedSearch}, {'ri-filter-off-line' : !hasShrinkedSearch}] " v-if="showShrink" @click="onShrink">
                           <span class="rmli-tooltip-message"> {{$t('toolbar.shrink')}}</span>
                    </i>
                    <i class="ri-close-line rmli-toolbar-reset" v-if="search !== ''" @click="reset"></i>
                    <i class="ri-search-line rmli-toolbar-search" v-else></i>
                </div>
        
          </div>
       </nav>
  </div>
</template>

<style lang="scss">
  @use '../scss/toolbar.scss';
</style>
<script>
import Combo from '../common/Combo.vue'
import Logger from '../util/Logger'
import * as RememberLi from '../services/RememberLi'

export default {
  name: 'Toolbar',
  emits: ['save', 'select', 'search', 'new', 'menu', 'shrink'],
  props: ['file', 'isDirty', 'open', 'settings'],
  data: function () {
    return {
        search: '',
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
    showShrink () {
      if (this.search !== '') {
        return !RememberLi.isTodoQuery(this.search) && !RememberLi.isDueQuery(this.search)
      }
      return false
    },
    hasShrinkedSearch () {
      return this.settings && this.settings.hasShrinkedSearch
    }
  },
  methods: {
    onMenu () {
      this.$emit('menu')
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
    onShrink () {
        console.debug('shrink')
        this.$emit('shrink')
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
    Logger.log('1', 'Toolbar.mounted() >', this.open)
  }
}
</script>
