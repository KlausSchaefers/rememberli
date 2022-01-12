<template>
<div class="rmli-dialog-background" v-if="isOpen" @mousedown="close">
  <div class="rmli-dialog" @click.stop="" @mousedown.stop="">
    <div class="rmli-dialog-body" @click.stop="">
      <slot>Enter your stuff here</slot>
    </div>
  </div>

</div>
</template>
<style lang="scss">
  @import "../scss/dialog.scss";
</style>

<script>

import Logger from '../util/Logger'

export default {
  name: "Dialog",
  mixins: [],
  data: function() {
  return {
    isOpen: false,
  }
  },
  computed: {

  },
  components: {
  },
  methods: {
    close (e) {
      Logger.log(2, '_Dialog.close()', e)
      this.isOpen = false
    },
    show () {
      Logger.log(2, '_Dialog.show()')
      this.isOpen = true
    }
  },
  async mounted() {

  }
}
</script>

