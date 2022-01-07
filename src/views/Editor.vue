<template>
  <div class="rmli-editor">
    <nav class="rmli-container">
      <Toolbar @save="onSave" @select="onSelect" @new="onNew" :file="file" :isDirty="isDirty" @search="onSearch"/>
    </nav>
    <main class="rmli-container rmli-element-list">
      
      <div class="rmli-element rmli-element-add-top" v-if="true">
         <Add @add="addStart" :placeholder="$t('add.start')" />
      </div>
     

      <div v-for="(element) in filteredElements" :key="element.id">
        <div class="rmli-element">
          <component :is="element.type" :element="element" @change="onElementChange(element, $event)" ref="elements"/>
        </div>

         <div class="rmli-element rmli-element-add-behind" v-if="hasAddBehind">
            <Add @add="addAfter(element, $event)" :placeholder="$t('add.behind')" />
          </div>
      </div>

    
      <pre v-if="isDebug">{{JSON.stringify(file.content.elements, null, 2)}}</pre>
    
     
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
        isDebug: false,
        hasAddBehind: false,
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
    },
    addAfter (element, value) {
      Logger.log(-1, 'Editor.addAfter()', element, value)
      let index = this.file.content.elements.findIndex(e => e.id === element.id)
      this.file.content.elements.splice(index + 1, 0, this.createNote(value)); 
    },
    addStart (value) {
      Logger.log(-1, 'Editor.addStart()', value)
      this.file.content.elements.unshift(this.createNote(value))
    },
    createNote (value) {
      return {
        id: new Date().getTime(),
        created: new Date().getUTCDate(),
        lastUpdate: new Date().getUTCDate(),
        elements:[],
        type: 'Note',
        value: value
      }
    },
    onElementChange (element, value) {
      if (value) {
        Logger.log(-1, 'Editor.onElementChange() > update element', element.id, value)
        element.value = value
        element.lastUpdate = new Date().getUTCDate()
      } else {
        Logger.log(1, 'Editor.onElementChange() > Delete element', element.id, value)
        let index = this.file.content.elements.findIndex(e => e.id === element.id)
        if (index > -1) {
          this.file.content.elements.splice(index, 1)
        }
      }
      this.onChange()
    },
    onChange () {
      this.isDirty = true
      // kick off auto save??
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
    },
    onNew () {
      Logger.log(-2, 'Editor.onNew()')
      this.file = {
          url: '',
          content: {
            created: new Date().getUTCDate(),
            lastUpdate: new Date().getUTCDate(),
            name: 'New File',
            elements: [
            ]
          }
      }
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
