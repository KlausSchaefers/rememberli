<template>
  <div class="rmli-splash" v-if="!file">

      <div class="rmli-splash-actions ">
          <a @click="onNew">
              <i class="ri-file-add-line" ></i> 
              <span>{{$t('actions.new')}}</span>
          </a>
        
          <a @click="onSelect">
              <i class="ri-folder-line"></i>
              <span>{{$t('actions.select')}}</span>
          </a>
      </div>

  </div>
  <div class="rmli-editor" v-if="file">

  
 
    <SideBar
        :hasMenu="hasMenu"
        @save="onSave" 
        @select="onSelect" 
        @new="onNew" 
        @exit="file = null"
        :file="file" 
        :isDirty="isDirty" 
        @search="onSearch"
        />

    <div class="rmli-editor-body">
        
        <Toolbar
          @menu="hasMenu = !hasMenu"
          @save="onSave" 
          @select="onSelect" 
          @new="onNew" 
          :file="file" 
          :isDirty="isDirty" 
          @search="onSearch"/>

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
              
        </main>
    </div>
  </div>
</template>

<style lang="scss">
  @import '../scss/splash.scss';
  @import '../scss/editor.scss';
</style>
<script>

import APIService from '../services/APIService'
import Toolbar from '../components/Toolbar'
import Note from '../components/Note'
import Add from '../components/Add'
import SideBar from '../components/SideBar'
import Logger from '../util/Logger'
//import * as Util from '../util/Util'

export default {
  name: 'Editor',
  data: function () {
      return {
        isDebug: false,
        hasAddBehind: false,
        hasMenu: true,
        query: '',
        isDirty: false,
        file: null,
        testFile: {
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
                value: 'Hello <b>Klaus</b>',
                order:0
              }
            ]
          }
        }
    }
  },
  components: {
    Toolbar,
    Note,
    Add,
    SideBar
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
      this.onChange()
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
       * 2) Otherwise we set the value
       * 
       * TODO: We could have here more, e.g. splitting
       */
      if (value) {
        Logger.log(1, 'Editor.onElementChange() > update element', element.id, value)
        if (element.value !== value) {
          element.value = value
          this.onChange(element)
        }
      } else {
        Logger.log(1, 'Editor.onElementChange() > Delete element', element.id, value)
        let index = this.file.content.elements.findIndex(e => e.id === element.id)
        if (index > -1) {
          this.file.content.elements.splice(index, 1)
          this.onChange(element)
        }
      }
    },
    onChange (element) {
      Logger.log(2, 'Editor.onChange()', element)
      this.file.content.elements.forEach((e, i) => {
        e.order = i
      })
      this.isDirty = true
      this.onSave()
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
      this.onSave()
    }
  },
  mounted () {
    this.api = new APIService()
    this.api.onSave(this.onSaveReply)
    this.api.onSelect(this.onSelectReply)
  }
}
</script>
