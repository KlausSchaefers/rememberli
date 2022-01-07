<template>
  <div class="rmli-editor">
    <nav class="rmli-container">
      <Toolbar @save="onSave" @select="onSelect" :file="file" :isDirty="isDirty" @search="onSearch"/>
    </nav>
    <main class="rmli-container">
      
      <!-- show only when not editing the new one? -->
      <div class="rmli-element rmli-element-add" v-if="true">
         <Add @change="addToTop"/>
      </div>
     

      <div v-for="(element,i) in filteredElements" :key="i" class="rmli-element">
         <component :is="element.type" :element="element" @change="onElementChange(element, $event)" ref="elements"/>
      </div>

      <div class="rmli-element rmli-element-add" v-if="true">
         <Add @change="addToEnd" />
      </div>
    
      <pre>{{JSON.stringify(file.content.elements, null, 2)}}</pre>
    
     
    </main>
  </div>
</template>

<style lang="scss">
  @import '../scss/editor.scss';
</style>
<script>

import APIService from '../services/APIService'
import Toolbar from '../components/Toolbar'
import Note from '../components/Note'
import Add from '../components/Add'
import Logger from '../util/Logger'

export default {
  name: 'Editor',
  data: function () {
      return {
        query: '',
        isDirty: false,
        file: {
          url: '',
          content: {
            created: new Date().getUTCDate(),
            lastUpdate: new Date().getUTCDate(),
            name: 'My File.json',
            elements: [
              {
                id: new Date().getTime(),
                created: new Date().getUTCDate(),
                lastUpdate: new Date().getUTCDate(),
                type: 'Note',
                value: 'Hello'
              }
            ]
          }
        }
    }
  },
  components: {
    Toolbar,
    Note,
    Add
  },
  computed: {
    filteredElements () {
      return this.file.content.elements
    }
  },
  methods: {
    onSearch (query) {
      Logger.log(-1, 'Editor.onSearch()', query)
      this.query = query
    },
    addToEnd (value) {
      Logger.log(-1, 'Editor.addToEnd()', value)
      this.file.content.elements.push({
        id: new Date().getTime(),
        created: new Date().getUTCDate(),
        lastUpdate: new Date().getUTCDate(),
        type: 'Note',
        value: value
      })
      this.$nextTick(() => {
        let ref = this.$refs.elements[this.$refs.elements.length - 1]
        if (ref) {
          ref.focus()
        }
      })
    },
    addToTop (value) {
      Logger.log(-1, 'Editor.addToTop()', value)
      this.file.content.elements.unshift({
        id: new Date().getTime(),
        created: new Date().getUTCDate(),
        lastUpdate: new Date().getUTCDate(),
        type: 'Note',
        value: value
      })
      this.$nextTick(() => {
        console.debug(this.$refs.elements)
        let ref = this.$refs.elements[0]
        if (ref) {
          ref.focus()
        }
      })
    },
    onElementChange (element, value) {
      Logger.log(1, 'Editor.onElementChange()', element, value)
      element.value = value
      this.isDirty = true
    },
    onChange () {
      this.isDirty = true
    },
    onSave () {
      Logger.log(2, 'Editor.save()', this.file)
      this.api.save(this.file)
    },
    onSaveReply(file) {
      Logger.log(2, 'Editor.onSaveReply()', file)
      this.file = file
      this.isDirty = false
    },
    onSelect () {
      Logger.log(2, 'Editor.onSelect()')
      this.api.select()
    },
    onSelectReply (file) {
      Logger.log(2, 'Editor.onSelectReply()', file)
      this.file = file
      this.isDirty = false
    }
  },
  mounted () {
    this.api = new APIService()
    this.api.onSave(this.onSaveReply)
    this.api.onSelect(this.onSelectReply)
  }
}
</script>
