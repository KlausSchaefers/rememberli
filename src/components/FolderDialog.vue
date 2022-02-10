<template>
  <RDialog ref="dialog">
      <div class="rmli-settings">
     
      
        <RadioList :options="folders" v-model="selected" :hasNew="true" />

      
        <div class="rmli-button-bar">
            <button class="rmli-button" @click="save">{{$t('common.save')}}</button>
            <button class="rmli-button rmli-button-secondary " @click="cancel">{{$t('common.cancel')}}</button>
        </div>
      </div>
  </RDialog>
</template>

<style lang="scss">
 
</style>
<script>

import RDialog from '../common/Dialog.vue'
import RadioList from '../common/RadioList.vue'
import Logger from '../util/Logger'
//import Util from '../util/Util'

export default {
  name: 'FolderDialog',
  emits: [],
  props: ['file'],
  data: function () {
    return {
        newFolderName:'',
        selected: ''
    }
  },
  components: {
    RDialog, RadioList
  },
  computed: {
      folders () {
          let result = []
          
          if (this.file && this.file.content.folders) {
              result = this.file.content.folders.map(f => {
                  return {value: f.id, label:f.label}
              })
          }
          result.unshift({
              value: '', label:this.$t('sidebar.all')
          })
          return result
      }
  },
  methods: {
    show (element, callback) {
      Logger.log(-1, 'FolderDialog.show()', element.folder)
      this.callback = callback
      this.selected = element.folder
      this.$refs.dialog.show()
    },
    save () {
      Logger.log(-1, 'FolderDialog.save()', this.selected)
      if (this.callback) {
        let selectedFolder = this.file.content.folders.find(f => f.id === this.selected)
     
        if (selectedFolder) {
            this.callback(selectedFolder)
        } else {
            this.callback({id: '', label: this.$t('sidebar.all')})
        }
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
