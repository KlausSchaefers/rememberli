
<template>
  <div class="rmli-logo">
     <div class="rmli-logo-mask"/>
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
