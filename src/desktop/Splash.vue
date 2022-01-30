<template>
  <div :class="'rmli-splash rmli-theme-' + settings.theme ">
      
      <div class="rmli-splash-cntr">
        <Logo />
        <div class="rmli-splash-actions ">
          
            <a @click="onNew">
                <i class="ri-file-add-line" ></i> 
                <span>{{$t('actions.new')}}</span>
            </a>
          
            <a @click="onSelect">
                <i class="ri-folder-line"></i>
                <span>{{$t('actions.select')}}</span>
            </a>
        </div>
      </div>

      <span class="rmli-splash-version"> {{version}} </span>

  </div>

</template>

<style lang="scss">
  @import '../scss/splash.scss';
</style>
<script>

import Logo from '../components/Logo'

export default {
  name: 'Splash',
  props:['version', 'settings'],
  emits: ['new', 'select'],
  data: function () {
      return {    
    }
  },
  components: {
    Logo 
  },
  methods:{
      onNew () {
          this.$emit('new')
      },
    onSelect () {
        this.$emit('select')
    }
  },
  mounted () {
   
  }
  
}
</script>
