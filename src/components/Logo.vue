
<template>
  <div class="rmli-logo rmli-logo-circle rmli-logo-r rmli-logo-triangle">
     <div class="rmli-logo-mask"/>
     <div class="rmli-logo-background"/>
  </div>
</template>

<style lang="scss">
  @import '../scss/logo.scss';
</style>
<script>

export default {
  name: 'Logo',
  emits: ['change', 'focus', 'click'],
  props: {
  },
  data: function () {
    return {
        hasFocus:false
    }
  },
  components: {
  },
  methods: {
  },
  mounted () {
   
  }
}
</script>
