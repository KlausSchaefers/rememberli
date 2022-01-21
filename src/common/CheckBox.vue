<template>


    <div class="rmli-check" @click.stop="setValue()">
      <input type="checkbox" :checked="modelValue"/>
      <span class="rmli-check-icon"></span>
      <label> {{label}}</label>
    </div>


</template>
<style lang="scss">
    @import "../scss/check.scss";
</style>

<script>


export default {
  name: 'RadioList',
  props: ['label', 'modelValue'],
  data: function () {
    return {
        uuid: 'checkbox' + Math.round(Math.random() * 10000000)
    }
  },
  methods: {
    setValue () {
      let value = !this.modelValue
      this.$emit('update:modelValue', value)
      this.$emit('change', value)
    }
  },
  async mounted () {
  }
}
</script>
