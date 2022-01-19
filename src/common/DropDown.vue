<template>
  <div :class="['rmli-dropdown', { 'rmli-dropdown-open': isOpen }]" @click="open">
    <label class="rmli-dropdown-label" v-if="label">{{label}}</label> 
    <i v-if="icon" :class="'rmli-drowpdown-icon ' + icon" />
    <div class="rmli-dropdown-popup">
        <slot/>
    </div>
  </div>
</template>
<style lang="scss">
@import "../scss/combo.scss";
@import "../scss/dropdown.scss";
</style>
<script>
import * as Util from "../util/Util"
import Logger from "../util/Logger"

export default {
  name: "Combo",
  props: ['label', 'icon'],
  emits: ['update:modelValue', 'change'],
  data: function() {
    return {
      isOpen: false,
    }
  },
  computed: {
  },
  methods: {
    open() {
      Logger.log(5, "DropDown.open()")
      this.isOpen = true
      this.bodyListner = Util.on(Util.body(), "mousedown", this.close)
    },
    close() {
      Logger.log(5, "DropDown.close()")
      this.isOpen = false
      if (this.bodyListner) {
          this.bodyListner.remove()
          delete this.bodyListner
      }
    }
  },
  watch: {},
  beforeUnmount() {
    Logger.log(1, "DropDown.beforeUnmount() enter")
    this.close()
  },
  mounted() {
    Logger.log(1, "DropDown.mounted() enter")
  }
}
</script>
