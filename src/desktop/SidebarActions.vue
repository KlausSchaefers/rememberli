<template>
 

    <div class="rmli-sidebar-actions">

        <a @click="onExit">
            <i class="ri-home-line"></i>
            <span>{{$t('actions.home')}}</span>
        </a>

        <a @click="onSettings">
            <i class="ri-sound-module-line"></i>
            <span>{{$t('actions.settings')}}</span>
        </a>

        <a @click="onHelp">
            <i class="ri-question-line"></i>
            <span>{{$t('actions.help')}}</span>
        </a>
    </div>
        

</template>

<style lang="scss">
  @import '../scss/sidebar.scss';
</style>
<script>
import Logger from '../util/Logger'

export default {
  name: 'SideBarActions',
  emits: [
      'save', 'select', 'search', 'new', 'exit', 'settings', 'help', 'load'
  ],
  props: ['file', 'settings', 'isDirty'],
  data: function () {
    return {       
    }
  },
  components: {
  },
  computed: {   
  },
  methods: {
    onNewFile () {
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
    onSettings () {
      Logger.log(3, 'SideBarActions.onSettings()')
      this.$emit('settings')
    },
    onHelp () {
      Logger.log(3, 'SideBarActions.onHelp()')
      this.$emit('help')
    },
  },
  mounted () {
  }
}
</script>
