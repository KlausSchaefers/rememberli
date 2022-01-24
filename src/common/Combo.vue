<template>
  <div :class="['rmli-combo rmli-dropdown', { 'rmli-dropdown-open': isOpen }]">
    <input class="rmli-combo-input" 
        @keyup="onKeyPress" 
        @change="onInputChange" 
        @blur="onBlur" 
        :value="modelValue"
        :placeholder="placeholder" 
        ref="comboInput"
    />
    <div class="rmli-dropdown-popup" v-if="matches.length > 0">
      
      <span
        v-for="(o, i) in matches"
        :key="o.label"
        :class="['rmli-combo-item', {'rmli-combo-item-selected': i === selectedIndex}]"
        @mousedown.stop="select(o, true)"
      >
        {{ o.label }}
      </span>
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
  props: ['options', 'placeholder', 'modelValue'],
  emits: ['update:modelValue', 'change'],
  data: function() {
    return {
      isOpen: false,
      selected: null,
      matches: [],
      selectedIndex: -1
    }
  },
  computed: {
    hints() {
      return this.options.map(o => {
        if (o.toLowerCase) {
          return {
            label: o,
            value: o
          }
        }
        return o
      })

    },
    selectOption() {
      return this.selected
    }
  },
  methods: {
    getInputValue () {
        return this.$refs.comboInput.value
    },
    onKeyPress(e) {

      let inputValue = e.target.value
      if (inputValue.length > 0) {
        let search = inputValue.toLowerCase()
        let parts = search.split(' ')
        if (parts.length > 1) {
          let last = parts.pop()
          if (last) {
            search = last
          }
        }

        this.matches = this.hints.filter(hint => {
          return hint.label.toLowerCase().indexOf(search) >= 0
        })
        
        if (this.matches.length > 0) {
          this.open()
          this.handleArrows(e)
        }
      } else {
        this.close()
      }
      this.onInputChange()
    },
    handleArrows(e) {
      var key = e.which || e.keyCode
     
      if (40 == key) { // UP
        this.selectedIndex = Math.min(this.matches.length, this.selectedIndex + 1)
        return
      }

      if (38 == key) { // DOWN
        this.selectedIndex = Math.max(-1, this.selectedIndex - 1)
        return
      }

      if (27 == key) { // ESC
        this.onInputChange()
        this.close()
        return
      }

      if (13 == key) { // ENTER
        Logger.log(-5, "Combo.handleArrows()", this.selectedIndex, this.matches)
        if (this.selectedIndex >= 0 && this.selectedIndex < this.matches.length) {
          this.select(this.matches[this.selectedIndex])
          this.onInputChange()
          return
        }
        this.close()
        return
      }
      this.selectedIndex = -1
    },
    blur () {
      if (this.$refs.comboInput) {
        this.$refs.comboInput.blur()
      }
    },
    onBlur () {
      this.onInputChange()
      this.close()
    },
    focus () {
        if (this.$refs.comboInput) {
            this.$refs.comboInput.focus()
        }
    },
    open() {
      Logger.log(-5, "Combo.open()")
      this.isOpen = true
    },
    close() {
      Logger.log(5, "Combo.close()")
      this.isOpen = false
      this.selectedIndex = -1
    },
    onInputChange () {
        Logger.log(-5, "Combo.onInputChange()", this.getInputValue())
        this.selected = this.getInputValue()
        this.$emit("update:modelValue", this.selected)
        this.$emit("change", this.selected)
    },
    select(option) {
        Logger.log(-5, "Combo.select()", option.value)
        // FIXME: make this better to append multi part queries
        let newValue= Util.replaceLastPart(this.selected, option.value)
        this.selected = newValue
        this.$refs.comboInput.value = newValue
        this.$emit("update:modelValue", this.selected)
        this.$emit("change", this.selected)
        this.close()
    }
  },
  watch: {},
  beforeUnmount() {
    Logger.log(1, "Combo.beforeUnmount() enter")
    this.close()
  },
  mounted() {
    Logger.log(1, "Combo.mounted() enter")
  }
}
</script>
