<template>
  <RDialog ref="dialog">
      <div class="rmli-settings">
     
        <h1>{{$t('settings.theme')}}</h1>
        <RadioList :options="themes" v-model="settings.theme"/>

        <h1 class="rmli-margin-top-l">{{$t('settings.fontSize')}}</h1>
        <RadioList :options="sizes" v-model="settings.fontSize"/>

        <h1 class="rmli-margin-top-l">{{$t('settings.pinned')}}</h1>
        <RadioList :options="hasPinning" v-model="settings.hasPinning"/>

        <div class="rmli-button-bar">
            <button class="rmli-button" @click="save">{{$t('common.save')}}</button>
            <button class="rmli-button rmli-button-secondary " @click="cancel">{{$t('common.cancel')}}</button>
        </div>
      </div>
  </RDialog>
</template>

<style lang="scss">
  @import '../scss/settings.scss';
</style>
<script>

import RDialog from '../common/Dialog.vue'
import RadioList from '../common/RadioList.vue'
import Logger from '../util/Logger'
//import Util from '../util/Util'

export default {
  name: 'SettingsDialog',
  emits: [],
  props: [],
  data: function () {
    return {
        themes: [
            {label: "Pop!", value: "default"},
            {label:"Soft", value: "soft"},
            {label:"Black & White", value: "bw"},
            {label:"Dark", value: "dark"}
        ],
        sizes: [
            {label: "Small", value: "s"},
            {label: "Medium", value: "m"},
            {label: "Large", value: "l"}
        ],
        hasPinning: [
            {label: "Notes can be pinned to top", value: true},
            {label: "No", value: false},
        ],
        settings: null
    }
  },
  components: {
    RDialog, RadioList
  },
  methods: {
    onChange (e) {
      Logger.log(-1, 'SettingsDialog.onChange()')
      this.settings = e
    },
    show (settings, callback) {
      Logger.log(-1, 'SettingsDialog.show()')
      this.callback = callback
      this.settings = settings
      this.$refs.dialog.show()
    },
    save () {
      Logger.log(-1, 'SettingsDialog.save()')
      if (this.callback && this.settings) {
        this.callback(this.settings)
      }
      this.close()
    },
    cancel () {
      Logger.log(-1, 'SettingsDialog.cancel()')
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
