<template>
  <RDialog ref="dialog">
      <div class="rmli-settings">
     
        <h1>{{$t('settings.theme')}}</h1>
        <RadioList :options="themes" v-model="settings.theme"/>

        <h1 class="rmli-margin-top-l">{{$t('settings.fontSize')}}</h1>
        <RadioList :options="sizes" v-model="settings.fontSize"/>

        <h1 class="rmli-margin-top-l">{{$t('settings.other')}}</h1>
        <div class="rmli-checkbox-list">
          <CheckBox v-model="settings.hasDueInTop" :label="$t('settings.hasDueInTop')"/>
          <CheckBox v-model="settings.hasDueFolder" :label="$t('settings.hasDueFolder')"/>
          <CheckBox v-model="settings.hasTimeline" :label="$t('settings.timeline')"/>
          <CheckBox v-model="settings.hasBorderTop" :label="$t('settings.hasBorderTop')"/>
          <CheckBox v-model="settings.hasDateLeft" :label="$t('settings.hasDateLeft')"/>
          <CheckBox v-if="false" v-model="settings.hasBeta" :label="$t('settings.beta')"/>
        </div>

        

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
import CheckBox from '../common/CheckBox.vue'
import Logger from '../util/Logger'
//import Util from '../util/Util'

export default {
  name: 'SettingsDialog',
  emits: [],
  props: [],
  data: function () {
    return {
        themes: [
            {label: "Light", value: "default"},
            {label:"Soft", value: "soft"},
            //{label:"Black & White", value: "bw"},
            //{label:"Dark", value: "dark"}
        ],
        sizes: [
            {label: "Small", value: "s"},
            {label: "Medium", value: "m"},
            {label: "Large", value: "l"}
        ],
        settings: null
    }
  },
  components: {
    RDialog, RadioList, CheckBox
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
