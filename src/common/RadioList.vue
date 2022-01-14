<template>
  <div class="rmli-radio-list">

    <div class="rmli-radio" v-for="o in options" :key="o.value" @click="setValue(o.value)">
      <input type="radio" :value="o.value" :checked="modelValue === o.value" />
      <span class="rmli-radio-icon"></span>
      <label> {{o.label}}</label>
    </div>

  </div>
</template>
<style lang="scss">
    @import "../scss/radio.scss";
</style>

<script>


export default {
  name: 'RadioList',
  props: ['options', 'modelValue'],
  data: function () {
    return {

    }
  },
  computed: {

  },
  components: {

  },
  methods: {
    setValue (value) {
      this.$emit('update:modelValue', value)
      this.$emit('change', value)
    }
  },
  watch: {
  },
  async mounted () {
  }
}
</script>
