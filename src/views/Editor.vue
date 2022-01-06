<template>
  <div class="rmli-editor">
    <Toolbar @save="save" @select="select" :file="file" :isDirty="isDirty"/>
    <textarea v-model="file.content.elements[0].value" @change="onChange"/>

    Dirty: {{isDirty}}
  </div>
</template>

<style lang="scss">
  @import url('../scss/editor.scss');
</style>
<script>

import APIService from '../services/APIService'
import Toolbar from '../components/Toolbar'
import Logger from '../util/Logger'

export default {
  name: 'Editor',
  data: function () {
      return {
        isDirty: false,
        file: {
          url: '',
          content: {
            created: new Date().getUTCDate(),
            lastUpdate: new Date().getUTCDate(),
            name: 'My File.json',
            elements: [
              {
                type: 'NOTE',
                value: 'Hello'
              }
            ]
          }
        }
    }
  },
  components: {
    Toolbar
  },
  methods: {
    onChange () {
      this.isDirty = true
    },
    save () {
      Logger.log(2, 'Editor.save()', this.file)
      this.api.save(this.file)
    },
    onSave(file) {
      Logger.log(2, 'Editor.onSave()', file)
      this.file = file
      this.isDirty = false
    },
    select () {
      Logger.log(2, 'Editor.select()')
      this.api.select()
    },
    onSelect (file) {
      Logger.log(2, 'Editor.onSelect()', file)
      this.file = file
      this.isDirty = false
    }
  },
  mounted () {
    this.api = new APIService()
    this.api.onSave(this.onSave)
    this.api.onSelect(this.onSelect)
  }
}
</script>
