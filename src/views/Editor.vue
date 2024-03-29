<template>
  <Splash :version="version" v-if="!file" :settings="settings" @new="onNew" @select="onSelect" @load="setFile"/>
  <div :class="'rmli-editor rmli-add-popX  rmli-theme-' + settings.theme + ' rmli-font-size-' + settings.fontSize" v-if="file">

    
    <SideBar
        :hasMenu="hasMenu"
        :settings="settings"
        @load="setFile"
        @save="onSave" 
        @select="onSelect" 
        @new="onNew" 
        @exit="file = null"
        @help="showHelp"
        @settings="showSettings"
        @setFolder="setFolder"
        @createFolder="createFolder"
        @changeFolder="changeFolder"
        @deleteFolder="deleteFolder"
        @moveElementToFolder="moveElementToFolder"
        @moveFolderAbove="moveFolderAbove"
        :file="file" 
        :isDirty="isDirty" 
        @search="setSearch"
        />

    <main :class="['rmli-editor-body rmli-drag-bar-below', {'rmi-highlight-pointer': hasHighLightPointer}]">

         <Toolbar
            :open="hasMenu"
            :settings="settings"
            :file="file" 
            :isDirty="isDirty" 
            ref="toolbar"
            @shrink="onShrink"
            @menu="hasMenu = !hasMenu"
            @save="onSave" 
            @select="onSelect"  
            @new="onNew" 
            @search="onSearch"
          />


        <div :class="'rmli-element-list ' + (hasListAnimation ? 'rmli-is-animated ': '')">
          <div class="rmli-container" ref="elementCntr">

         
         
                
                  <h1 class="rmli-pinned" v-if="filteredElements.pinned.length > 0">
                    {{settings.hasDueInTop ? $t('list.pinnedAndDue'): $t('list.pinned')}}
                  </h1>
            
                  <transition-group name="list" tag="div">
                    <div :class="'rmli-element '" v-for="(element) in filteredElements.pinned" :key="element.id" :data-element-id="element.id">
                        <component 
                          :is="element.type" 
                          :element="element" 
                          :settings="settings"
                          :query="query"
                          :hasMenu="hasMenu"
                          :isTodoQuery="isTodoQuery"
                          :now="now"
                          @hint="showStatusMessage"
                          @folder="showFolderDialog(element)"
                          @alarm="onAlarm(element, $event)"
                          @create="onCreate(element)"
                          @pinned="onPinned(element, $event)"
                          @change="onElementChange(element, $event)" 
                          @search="setSearch"
                          @join="onJoinElement(element)"
                          :placeholder="$t('note.remove')"
                          ref="elements"/>
                    </div>
                  </transition-group>
              
              

                  <h1 :class="{'rmli-margin-top-xxl': filteredElements.pinned.length > 0 }">
                      {{selectedFolder ? selectedFolder.label : $t('list.rest')}}
                  </h1>
            
                  <div class="rmli-element rmli-element-add rmli-element-add-top">
                    <Add @add="addStart" :placeholder="$t('add.start')" ref="add" :settings="settings"/>
                  </div>
              
                  <transition-group name="list" tag="div">
                    <div class="rmli-element" v-for="(element) in filteredElements.rest" :key="element.id" :data-element-id="element.id">
                      <component 
                        :is="element.type"
                        :settings="settings"
                        :element="element" 
                        :query="query"
                        :isTodoQuery="isTodoQuery"
                        :now="now"
                        @hint="showStatusMessage"
                        @search="setSearch"
                        @folder="showFolderDialog(element)"
                        @alarm="onAlarm(element, $event)"
                        @create="onCreate(element)"
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
    <CreateDialog ref="createDialog" />
    <SettingsDialog ref="settingsDialog"/>
    <HelpDialog ref="helpDialog" @openWebLink="onOpenWebLink" :version="version"/>
    <FolderDialog ref="folderDialog" :file="file"/>
  </div>
  <div :class="'rmli-status rmli-status-' + (status.visible ? 'visibale' : 'hidden')"> 
    {{status.message}}
  </div>
</template>

<style lang="scss">

  @import '../scss/editor.scss';
  @import '../scss/highlight.scss';
  @import '../scss/animation.scss';
  @import '../scss/theme-soft.scss';
  @import '../scss/theme-bw.scss';
  @import '../scss/theme-dark.scss';
</style>
<script>

import APIService from '../services/APIService'
import AlarmDialog from '../components/AlarmDialog.vue'
import CreateDialog from '../components/CreateDialog.vue'
import SettingsDialog from '../components/SettingsDialog.vue'
import FolderDialog from '../components/FolderDialog.vue'
import Splash from '../desktop/Splash.vue'
import Toolbar from '../components/Toolbar'
import Note from '../components/Note'
import Add from '../components/Add'
import HelpDialog from '../components/HelpDialog'
import SideBar from '../components/SideBar'
import Logger from '../util/Logger'
import SearchService from '../services/SearchService'
import HistoryService from '../services/HistoryService'
import * as Util from '../util/Util'
import * as RememberLi from '../services/RememberLi'

export default {
  name: 'Editor',
  props:['value'],
  data: function () {
      return {
        version: '1.0.17',
        settings: {
          theme: 'default',
          fontSize: 's',
          hasDueFolder: true,
          hasTodoFolder: true,
          hasTimeline: false,
          hasBorderTop: true,
          hasDateLeft: false,
          hasDueInTop: false,
          hasBeta: false,
          needMetaKeyForNoteAction: false,
          hideStatusForToDoView: false,
          hasShrinkedSearch: false
        },
        status: {
          message: '',
          visible: false
        },
        hasListAnimation: false,
        hasMenu: false,
        query: '',
        isDirty: false,
        file: null,
        searchResultsScores: {},
        selectedFolder:'',
        selectedFolderName: '',
        lastQuery: new Date().getTime(),
        tagsAndPersons: [':due', ':todo'],
        now: 0,
        metaKeyPressed: false
    }
  },
  components: {
    Toolbar,
    Note,
    Add,
    SideBar,
    AlarmDialog,
    SettingsDialog,
    Splash,
    HelpDialog,
    FolderDialog,
    CreateDialog
  },
  provide() {
    return {
      tagsAndPersons: this.tagsAndPersons
    }
  },
  computed: {
    hasHighLightPointer () {
      return !this.settings.needMetaKeyForNoteAction || this.metaKeyPressed
    },
    isTodoQuery () {
      Logger.log(2, 'Editor.isTodoQuery()', this.query, RememberLi.isTodoQuery(this.query))
      return RememberLi.isTodoQuery(this.query)
    },
    folderElements () {
      if (this.selectedFolder) {
        Logger.log(2, 'Editor.folderElements()', this.selectedFolder)
        return this.file.content.elements.filter(f => f.folder === this.selectedFolder.id)
      }
      return this.file.content.elements
    },
    filteredElements () {
      let elements = this.folderElements
      if (this.searchService.isValidQuery(this.query)) {
        Logger.log(1, 'Editor.filteredElements() > search')
        return this.getSplittedElements(this.getFilteredElements(elements))
      }
      return this.getSplittedElements(elements)
    }
  },
  methods: {
    getSplittedElements (elements) {
      const pinned = []
      const rest = []
      const now = new Date().getTime()
      elements.forEach(e => {
        if (e.pinned) {
          pinned.push(e)
        } else {
          if (this.settings.hasDueInTop && Util.isDue(e, now)) {
            pinned.push(e)
          } else {
            rest.push(e)
          }
        }
      })
      return {pinned, rest}
    },
    setSearch (value) {
      Logger.log(1, 'Editor.setSearch()')
      this.$refs.toolbar.setSearch(value)
    },
    onSearch (query) {
      Logger.log(1, 'Editor.onSearch()', query)
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
        this.hasListAnimation = true
        element.due = dueDate
        this.onChange(element, true)
        setTimeout(() => this.hasListAnimation = false, 1000)
      })
    },
    onCreate (element) {
      Logger.log(-1, 'Editor.onCreate() >  element', element.id)
      this.$refs.createDialog.show(element.created, (newCreate) => {
        Logger.log(-1, 'Editor.onCreate() >  element', element.id, newCreate)
        if (newCreate > 0) {
          this.hasListAnimation = true
          element.created = newCreate
          this.sortNotes()
          this.onChange(element, true)
          setTimeout(() => this.hasListAnimation = false, 1000)
        }
      })
    },
    sortNotes () {
      this.file.content.elements.sort((a,b) => {
        return b.created - a.created
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
        Logger.log(-1, 'Editor.onElementChange() > update element', element.id)
        if (element.value !== value) {
          this.historyService.change(element, value, this.file)
          element.value = value
          this.onChange(element, true)
        }
      } else {
        Logger.log(-1, 'Editor.onElementChange() > Delete element', element.id, value)
        let index = this.file.content.elements.findIndex(e => e.id === element.id)
        if (index > -1) {
          this.historyService.delete(element, this.file)
          this.file.content.elements.splice(index, 1)
          this.onChange(element)
        }
      }
    },
    onChange (element, updateIndex) {
      Logger.log(1, 'Editor.onChange()', element)
      if (updateIndex) {
        this.searchService.indexElement(element)
        this.updateTagsAndPersons()
      }      
      this.isDirty = true
      this.onSave()
    },
    updateTagsAndPersons () {
      this.searchService.updateTagsAndPersons(this.tagsAndPersons)
    },
    onSave () {
      Logger.log(2, 'Editor.save()', this.file)
      this.api.save(this.file)
    },
    onSaveReply(file) {
      Logger.log(2, 'Editor.onSaveReply()', file)
      if (!this.file.url) {
        Logger.log(-2, 'Editor.onSaveReply() > set url', file.url)
        this.file.url = file.url
      }
      this.isDirty = false
      this.showStatusMessage('status.saved')
      this.saveLastFile()
    },
    onSelect () {
      Logger.log(2, 'Editor.onSelect()')
      this.api.select()
    },
    onSelectReply (file) {
      Logger.log(2, 'Editor.onSelectReply()', file)
      this.setFile(file)
      this.showStatusMessage('status.welcome')
    },
    setFile (file) {
      Logger.log(2, 'Editor.setFile()', file)
      this.file = file
      this.isDirty = false
      this.query = ''
      this.searchService.indexAll(this.file)
      this.updateTagsAndPersons()
      this.saveLastFile()
    },
    saveLastFile () {
      if (this.file && this.file.url) {
        localStorage.setItem('rmli-last-url', this.file.url)
      }
    },
    loadLastFile () {
      let url = localStorage.getItem('rmli-last-url')
      if (url) {
        Logger.log(-2, 'SideBarActions.loadLastFile()', url)
        this.api.load(url)
      }
    },
    onNew () {
      Logger.log(-2, 'Editor.onNew()')
      this.file = RememberLi.createFile()
      this.isDirty = false
      this.onSave()
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
    showStatusMessage (msgKey, type = 'success') {
      if (this.$t instanceof Function) {
        const msg = this.$t(msgKey)
        this.status.message = msg
        this.status.visible = true
        this.status.type = type
        setTimeout(() => this.status.visible = false, 1000)
      }
    },
    /**
     *  Folders
     */
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
      Logger.log(2, 'Editor.deleteFolder() > ', folderId)
      this.file.content.folders = this.file.content.folders.filter(f => f.id !== folderId)
      this.onSave()
    },
    createFolder (folderName) {
      Logger.log(2, 'Editor.createFolder() > ', folderName)
      if (!this.file.content.folders) {
        this.file.content.folders = []
      }
      this.file.content.folders.push({
         id: 'f' + new Date().getTime() + '_' + folderName,
         label: folderName
      })
      this.onSave()
    },
    showFolderDialog (element) {
      Logger.log(-2, 'Editor.showFolderDialog() > ', element)
      this.$refs.folderDialog.show(element, folder => {
        Logger.log(-2, 'Editor.showFolderDialog() > ', folder)
        this.moveElementToFolder(folder, element.id)
      })
    },
    moveElementToFolder (folder, elementId) {
      Logger.log(2, 'Editor.moveElementToFolder() > ', folder, elementId)
      let element = this.file.content.elements.find(e => e.id === elementId)
      if (element) {
        this.historyService.move(element, element.folder, folder.id)
        element.folder = folder.id
        this.onSave()
      } else {
        Logger.log(-2, 'Editor.moveElementToFolder() > Could not find element', elementId)
      }
    },
    moveFolderAbove (sourceId, targetId) {
        Logger.log(-2, 'Editor.moveFolderAbove() > ', sourceId, targetId)
        let sourceFolder = this.file.content.folders.find(f => f.id === sourceId)
        let folders = this.file.content.folders.filter(f => f.id !== sourceId)
        let targetIndex = folders.findIndex(f => f.id === targetId)
        if (targetIndex > -1) {
          folders.splice(targetIndex, 0, sourceFolder)
          this.file.content.folders = folders
          this.onSave()
        } else {
          Logger.log(-2, 'Editor.moveFolderAbove() > ', sourceId, targetId)
        }
        
    },
    /**
     *  Dialogs
     */
    showSettings () {
      Logger.log(2, 'Editor.showSettings()')
      this.$refs.settingsDialog.show(this.settings, (settings) => {
          localStorage.setItem('rmli-settings', JSON.stringify(settings))
      })
    },
    initSettings () {
      Logger.log(2, 'Editor.initSettings()')
      let value = localStorage.getItem('rmli-settings')
      if (value) {
        this.settings = JSON.parse(value)
      }
    },
    showHelp () {
      Logger.log(-2, 'Editor.showHelp()')
      this.$refs.helpDialog.show()
    },
    onOpenWebLink (e) {
      Logger.log(-2, 'Editor.showHelp()', e)
      this.api.openLink(e)
    },
    initRefreshTimer () {
      this.now = new Date().getTime()
      this.refreshTimer = setInterval(() => {
        Logger.log(-2, 'Editor.initRefreshTimer() > Update now')
        this.now = new Date().getTime()
      }, 3600 * 1000)
    },
    onKeyUp (e) {
      this.metaKeyPressed = e.metaKey
    },
    onKeyDown (e) {
      this.metaKeyPressed = e.metaKey
      if (e.key === 'f' && e.ctrlKey && this.$refs.toolbar) {
        Logger.log(-2, 'Editor.onKeyDown() > search')
        this.$refs.toolbar.focus()
      }
      if (e.key === 'n' && e.ctrlKey && this.$refs.add) {
        Logger.log(-2, 'Editor.onKeyDown() > new')
        this.$refs.add.focus()
      }
       if (e.key === 's' && e.ctrlKey && this.$refs.toolbar) {
        Logger.log(-2, 'Editor.onKeyDown() > shrink')
        this.onShrink()
      }
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        Logger.log(-2, 'Editor.onKeyDown() > undo')
        this.historyService.undo(this.file)
        this.onChange()
      }
    },
    onShrink () {
      Logger.log(-2, 'Editor.onKeyDown() > onShrink')
      this.settings.hasShrinkedSearch = !this.settings.hasShrinkedSearch
    }
  },
  mounted () {
    this.initSettings()
    this.initRefreshTimer()
    this.api = new APIService()
    this.api.onSave(this.onSaveReply)
    this.api.onSelect(this.onSelectReply)
    this.api.onAppLoaded()
    this.searchService = new SearchService()
    this.historyService = new HistoryService()
    this.keyUpHandler = (e) => this.onKeyUp(e)
    this.keyDownHandler = (e) => this.onKeyDown(e) 
    window.addEventListener('keyup', this.keyUpHandler );
    window.addEventListener('keydown', this.keyDownHandler );
    if (this.value) {
      this.file = this.value
    } else {        
      this.loadLastFile()  
    }
  },
  beforeUnmount () {
    if (this.keyUpHandler) {
      window.removeEventListener('keyup', this.keyUpHandler);
    }
    if (this.keyDownHandler) {
      window.removeEventListener('keydown', this.keyDownHandler);
    }
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }
    this.api.cleanUp()
  }
}
</script>
