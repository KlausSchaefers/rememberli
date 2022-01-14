<template>
  <div :class="'rmli-splash rmli-theme-' + settings.theme " v-if="!file" @keyup="onKeyUp">
      
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
  <div :class="'rmli-editor rmli-theme-' + settings.theme + ' rmli-font-size-' + settings.fontSize" v-if="file">

    
    <SideBar
        :hasMenu="hasMenu"
        @save="onSave" 
        @select="onSelect" 
        @new="onNew" 
        @exit="file = null"
        @settings="showSettings"
        @setFolder="setFolder"
        @createFolder="createFolder"
        @changeFolder="changeFolder"
        @deleteFolder="deleteFolder"
        :file="file" 
        :isDirty="isDirty" 
        @search="onSearch"
        />

    <main class="rmli-editor-body rmli-drag-bar-below">

         <Toolbar
            @menu="hasMenu = !hasMenu"
            @save="onSave" 
            @select="onSelect" 
            ref="toolbar"
            @new="onNew" 
            :file="file" 
            :isDirty="isDirty" 
            @search="onSearch"/>

        <div :class="'rmli-element-list ' + (hasListAnimation ? 'rmli-is-animated ': '')">
          <div class="rmli-container" ref="elementCntr">
          
              <div class="rmli-element rmli-element-no-border rmli-element-add-top" v-if="!settings.isPinnedTopLayout">
                <Add @add="addStart" :placeholder="$t('add.start')" ref="add"/>
              </div>
              
              <h1 v-if="filteredElements.pinned.length > 0 && settings.isPinnedTopLayout">{{$t('list.pinned')}}</h1>
        
              <transition-group name="list" tag="div">
                <div :class="'rmli-element' + (i === 0 && settings.isPinnedTopLayout ? 'rmli-element-no-border' : '')" v-for="(element,i) in filteredElements.pinned" :key="element.id" :data-element-id="element.id">
                    <component 
                      :is="element.type" 
                      :element="element" 
                      :query="query"
                      @alarm="onAlarm(element, $event)"
                      @pinned="onPinned(element, $event)"
                      @change="onElementChange(element, $event)" 
                      @join="onJoinElement(element)"
                      :placeholder="$t('note.remove')"
                      ref="elements"/>
                </div>
              </transition-group>
          
           

              <h1 v-if="settings.isPinnedTopLayout" :class="{'rmli-margin-top-xxl': filteredElements.pinned.length > 0 }">{{$t('list.rest')}}</h1>
        
               <div class="rmli-element rmli-element-no-border rmli-element-add-top" v-if="settings.isPinnedTopLayout">
                <Add @add="addStart" :placeholder="$t('add.start')" ref="add"/>
              </div>
          
              <transition-group name="list" tag="div">
                <div class="rmli-element" v-for="(element) in filteredElements.rest" :key="element.id" :data-element-id="element.id">
                  <component 
                    :is="element.type" 
                    :element="element" 
                    :query="query"
                    @alarm="onAlarm(element, $event)"
                    @pinned="onPinned(element, $event)"
                    @change="onElementChange(element, $event)" 
                    @join="onJoinElement(element)"
                    :placeholder="$t('note.remove')"
                    ref="elements"/>
                </div>
              </transition-group>
            

          </div>
              
        </div>
    </main>
    <AlarmDialog ref="alarmDialog"/>
    <SettingsDialog ref="settingsDialog"/>
  </div>
  <div :class="'rmli-status rmli-status-' + (status.visible ? 'visibale' : 'hidden')"> 
    {{status.message}}
  </div>
</template>

<style lang="scss">
  @import '../scss/splash.scss';
  @import '../scss/editor.scss';
  @import '../scss/animation.scss';
  @import '../scss/theme-soft.scss';
</style>
<script>

import APIService from '../services/APIService'
import AlarmDialog from '../components/AlarmDialog.vue'
import SettingsDialog from '../components/SettingsDialog.vue'
import Toolbar from '../components/Toolbar'
import Note from '../components/Note'
import Add from '../components/Add'
import SideBar from '../components/SideBar'
import Logger from '../util/Logger'
import SearchService from '../services/SearchService'
import HistoryService from '../services/HistoryService'
//import * as Util from '../util/Util'

export default {
  name: 'Editor',
  data: function () {
      return {
        settings: {
          theme: 'soft',
          fontSize: 's',
          isPinnedTopLayout: true,
          isSearchPinned: true
        },
        status: {
          message: '',
          visible: false
        },
        hasListAnimation: false,
        hasMenu: true,
        query: '',
        isDirty: false,
        file: null,
        searchResultsScores: {},
        selectedFolder:'',
        lastQuery: new Date().getTime()
    }
  },
  components: {
    Toolbar,
    Note,
    Add,
    SideBar,
    AlarmDialog,
    SettingsDialog
  },
  computed: {
    folderElements () {
      if (this.selectedFolder) {
        console.debug(this.selectedFolder)
        return this.file.content.elements.filter(f => f.folder === this.selectedFolder.id)
      }
      return this.file.content.elements
    },
    filteredElements () {
      /** 
       * FIXME: add pinned stuff here
       */
      let elements = this.folderElements
      if (this.searchService.isValidQuery(this.query)) {
        Logger.log(-1, 'Editor.filteredElements()')
        if (this.settings.isSearchPinned) {
          return this.getSplittedElements(this.getFilteredElements(elements))
        } else {
          return this.getConcatedElements(this.getFilteredElements(elements))
        }
        
      }
      return this.getSplittedElements(elements)
    }
  },
  methods: {
     getConcatedElements (elements) {

      let pinned = []
      let rest = []

      elements.forEach(e => {
        if (e.pinned) {
          pinned.push(e)
        } else {
          rest.push(e)
        }
      })

      return {
          rest: pinned.concat(rest),
          pinned:[]
      }
    },
    getSplittedElements (elements) {

      let pinned = []
      let rest = []

      elements.forEach(e => {
        if (e.pinned) {
          pinned.push(e)
        } else {
          rest.push(e)
        }
      })

      return {pinned, rest}
    },
    onSearch (query) {
      Logger.log(-1, 'Editor.onSearch()', query)
      this.query = query
      this.lastQuery = new Date().getTime()
      this.searchResultsScores = this.searchService.find(query, this.file, this.selectedFolder)
    },
    getFilteredElements (elements) {
        let results = elements.filter(e => {
          /**
           * We return all the results from the search engine, and 
           * all elements that we created after the search, so that they do not disappear
           */
          return this.searchResultsScores[e.id] || e.created > this.lastQuery
        })
        return results
    },
    addToEnd (value) {
      Logger.log(-1, 'Editor.addToEnd()', value)
      const note = this.createNote(value)
      this.historyService.add(note, 'end', this.file)
      this.file.content.elements.push(note)
      this.onChange(note, true)
    },
    addAfter (element, value) {
      Logger.log(-1, 'Editor.addAfter()', element, value)
      let index = this.file.content.elements.findIndex(e => e.id === element.id)
      const note = this.createNote(value)
      this.file.content.elements.splice(index + 1, 0, note); 
      this.onChange(note, true)
    },
    addStart (value) {
      Logger.log(-1, 'Editor.addStart()', value)
      const note = this.createNote(value)
      this.historyService.add(note, 'start', this.file)
      this.file.content.elements.unshift(note)
      this.onChange(note, true)
    },
    getTimestamp () {
      return new Date().getTime()
    },
    onJoinElement (element) {
      Logger.log(-1, 'Editor.onJoinElement() > split element', element.id) 
    },
    onAlarm (element) {
      Logger.log(-1, 'Editor.onAlarm() >  element', element.id)
     
      this.$refs.alarmDialog.show(element.due, (dueDate) => {
        Logger.log(-1, 'Editor.onAlarm() >  element', element.id, dueDate)
        element.due = dueDate
        this.onChange(element, true)
      })
      
      
    },
    onPinned (element, value) {
      Logger.log(-1, 'Editor.onPinned() >  element', element.id, value)
      element.pinned = value
      this.hasListAnimation = true
      this.onChange(element, true)
      setTimeout(() => this.hasListAnimation = false, 1000)
      //this.scrollToElement(element.id)
      // make a small scrol to?
    },
    scrollToElement (id, smooth = true) {
        Logger.log(1, 'scrollToElement.scrollToElement() >  element', id)
        this.$nextTick(() => {
          let div = document.querySelector(`div[data-element-id='${id}']`)
          if (div) {
            div.scrollIntoView({
              behavior: smooth ? 'smooth' : '', 
              block: "start", 
              inline: "nearest"
            })
          } else {
            Logger.warn('scrollToElement.scrollToElement() >  cound not find', id)
          }
        })
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
          this.historyService.change(element, value, this.file)
          element.value = value
          this.onChange(element, true)
        }
      } else {
        Logger.log(1, 'Editor.onElementChange() > Delete element', element.id, value)
        let index = this.file.content.elements.findIndex(e => e.id === element.id)
        if (index > -1) {
          this.historyService.delete(element, this.file)
          this.file.content.elements.splice(index, 1)
          this.onChange(element)
        }
      }
    },
    onChange (element, updateIndex) {
      Logger.log(2, 'Editor.onChange()', element)
      if (updateIndex) {
        this.searchService.indexElement(element)
      }
      // TODO: parse tags and people
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
      this.showStatusMessage('status.saved')
    },
    onSelect () {
      Logger.log(2, 'Editor.onSelect()')
      this.api.select()
    },
    onSelectReply (file) {
      Logger.log(2, 'Editor.onSelectReply()', file)
      this.file = file
      this.isDirty = false
      this.searchService.indexAll(this.file)
      this.showStatusMessage('status.welcome')
    },
    onNew () {
      Logger.log(-2, 'Editor.onNew()')
      this.file = this.createFile()
      this.isDirty = false
      this.onSave()
    },
    createFile () {
      return {
          url: '',
          content: {
            created: new Date().getUTCDate(),
            lastUpdate: new Date().getUTCDate(),
            name: 'New File',
            folders: [],
            elements: []
          }
      }
    },
    createNote (value) {
      return {
        id: 'n' + new Date().getTime(),
        created: this.getTimestamp(),
        lastUpdate: this.getTimestamp(),
        elements:[],
        pinned:false,
        type: 'Note',
        value: value,
        folder: this.selectedFolder ? this.selectedFolder.id : ''
      }
    },
    onKeyUp (e) {
      if (e.key === 'f' && e.ctrlKey && this.$refs.toolbar) {
        Logger.log(-2, 'Editor.onKeyUp() > search')
        this.$refs.toolbar.focus()
      }
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        Logger.log(-2, 'Editor.onKeyUp() > undo')
        this.historyService.undo(this.file)
        this.onChange()
      }
    },
    showStatusMessage (msgKey, type = 'success') {
      if (this.$t instanceof Function) {
        const msg = this.$t(msgKey)
        this.status.message = msg
        this.status.visible = true
        this.status.type = type
        setTimeout(() => this.status.visible = false, 1000)
      }
    },
    setFolder (folder) {
      Logger.log(-2, 'Editor.setFolder() > ', folder)
      this.selectedFolder = folder
    },
    changeFolder (folderId, newLabel) {
      Logger.log(-2, 'Editor.changeFolder() > ', folderId, newLabel)
      this.hasListAnimation = false
      let found = this.file.content.folders.find(f => f.id === folderId)
      if (found) {
        found.label = newLabel
        this.onSave()
      }
    },
    deleteFolder (folderId) {
      Logger.log(-2, 'Editor.deleteFolder() > ', folderId)
      this.file.content.folders = this.file.content.folders.filter(f => f.id !== folderId)
      this.onSave()
    },
    createFolder (folderName) {
      Logger.log(-2, 'Editor.createFolder() > ', folderName)
      if (!this.file.content.folders) {
        this.file.content.folders = []
      }
      this.file.content.folders.push({
         id: 'f' + new Date().getTime(),
         label: folderName
      })
      this.onSave()
    },
    showSettings () {
      Logger.log(-2, 'Editor.showSettings() > ')
      this.$refs.settingsDialog.show(this.settings, () => {
        this.onSave()
      })
    }
  },
  mounted () {
    this.api = new APIService()
    this.api.onSave(this.onSaveReply)
    this.api.onSelect(this.onSelectReply)
    this.searchService = new SearchService()
    this.historyService = new HistoryService()
    this.keyUpHandler = (e) => this.onKeyUp(e) 
    window.addEventListener('keydown', this.keyUpHandler );
  },
  beforeUnmount () {
    if (this.keyUpHandler) {
      window.removeEventListener('keydown', this.keyUpHandler);
    }
  }
}
</script>
