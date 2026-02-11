<template>
  <RDialog ref="dialog" class="rmli-alarm"> 
      <DatePicker v-if="selected" :value="selected" @change="onChange" />
      <div class="rmli-button-bar">
        <button class="rmli-button rmli-button-danger" @click="save">{{$t('create.set')}}</button>
        <button class="rmli-button rmli-button-secondary " @click="cancel">{{$t('create.cancel')}}</button>
      </div>
  </RDialog>
</template>

<style lang="scss">
  @use '../scss/alarm.scss';
</style>
<script>

import RDialog from '../common/Dialog.vue'
import DatePicker from '../common/DatePicker.vue'
import Logger from '../util/Logger'

export default {
  name: 'AlarmDialog',
  emits: [],
  props: [],
  data: function () {
    return {
        selected: null
    }
  },
  components: {
    RDialog, DatePicker
  },
  methods: {
    onChange (e) {
      Logger.log(-1, 'CreateDialog.onChange()')
      this.selected = e
    },
    show (created, callback) {
      Logger.log(-1, 'CreateDialog.show()', created)
    
      this.callback = callback
      if (created) {
        this.selected = new Date(created)
      } else {
        this.selected = new Date()
      }
      this.$nextTick(() => {
          this.$refs.dialog.show()
      })
    },
    save () {
      Logger.log(-1, 'CreateDialog.save()')
      if (this.callback && this.selected) {
        this.callback(this.selected.getTime())
      }
      this.close()
    },
    cancel () {
      Logger.log(-1, 'CreateDialog.cancel()')
      if (this.callback) {
        this.callback(0)
      }
      this.close()
    },
    close () {
      this.selected = null
      this.$refs.dialog.close()
    }
  },
  mounted () {
  }
}
</script>
