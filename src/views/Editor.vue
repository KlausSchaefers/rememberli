<template>
  <div class="rmli-editor">
    <nav class="rmli-container">
      <Toolbar 
        @save="onSave" 
        @select="onSelect" 
        @new="onNew" 
        :file="file" 
        :isDirty="isDirty" 
        @search="onSearch"
        :placeholder="$t('add.start')"/>
    </nav>
    <main class="rmli-container rmli-element-list">
      
      <div class="rmli-element rmli-element-add-top" v-if="true">
         <Add @add="addStart" :placeholder="$t('add.start')" />
      </div>
     

      <div v-for="(element) in filteredElements" :key="element.id">
        <div class="rmli-element">
          <component 
            :is="element.type" 
            :element="element" 
            @change="onElementChange(element, $event)" 
            @join="onJoinElement(element)"
            :placeholder="$t('note.remove')"
            ref="elements"/>
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
import * as Util from '../util/Util'

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
            created: this.getTimestamp(),
            lastUpdate: this.getTimestamp(),
            name: 'My File.json',
            elements: [
              {
                id: new Date().getTime(),
                created: this.getTimestamp(),
                lastUpdate: this.getTimestamp(),
                type: 'Note',
                value: 'Hello <b>Klaus</b>'
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
      let note = this.createNote(value)
      this.file.content.elements.push(note)
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
        created: this.getTimestamp(),
        lastUpdate: this.getTimestamp(),
        elements:[],
        type: 'Note',
        value: value
      }
    },
    getTimestamp () {
      return new Date().getTime()
    },
    onJoinElement (element) {
      Logger.log(-1, 'Editor.onJoinElement() > split element', element.id) 
    },
    onElementChange (element, value) {
      /**
       * Here we do some evil parsing
       * 
       * 1) If value === '', we delete the node
       * 
       * 2) If we have '---' inside we split
       * 
       * 3) Otherwise we set the value
       */
      if (value) {
     
        element.lastUpdate = this.getTimestamp()
        let parts = value.split('---')

        if (parts.length > 1) {

          Logger.log(-1, 'Editor.onElementChange() > split element', element.id, parts) 
          let index = this.file.content.elements.findIndex(e => e.id === element.id)
          element.value = parts[0]
          for (let i = 1; i < parts.length; i++) {
            let part = parts[i].trim()
            
            let note = this.createNote(part)
            this.file.content.elements.splice(index + i, 0, note); 
          }

        } else {

          Logger.log(-1, 'Editor.onElementChange() > update element', element.id, value)
          Logger.log(-1, 'Editor.onElementChange() > update element', Util.getText(value))
          element.value = value

        }
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
              {
                id: new Date().getTime(),
                created: new Date().getUTCDate(),
                lastUpdate: new Date().getUTCDate(),
                type: 'Note',
                value: 'Hello -&gt; world.<br><br>Papa was <b>here</b>'
              }
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
