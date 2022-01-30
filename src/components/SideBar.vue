<template>
  <div :class="'rmli-sidebar rmli-sidebar-' + (hasMenu ? 'open' : 'closed') ">

    <div class="rmli-sidebar-content rmli-drag-bar-below">
        
        <div class="rmli-sidebar-folder-list rmli-sidebar-list">

          <div class="rmli-sidebar-section-header">
               <span>{{$t('sidebar.folders')}}</span>
                <i class="ri-add-line rmli-folder-add rmli-tooltip" @click="showNewFolder" v-if="false" >
                    <span class="rmli-tooltip-message"> {{$t('sidebar.new')}}</span>
                </i> 
          </div>

           <a @click="setFolder(null)" 
            :class="[
                'rmli-sidebar-folder', 
                {'rmli-sidebar-folder-selected': selectedFolder === null },
                {'rmli-sidebar-folder-dnd': dropFolder && dropFolder.id === allFolder.id }]"
                @dragover="onDragOver(allFolder, $event)"
                @dragleave="onDragLeave(allFolder, $event)"
                @drop="onDrop(allFolder, $event)"
                >
                  <i :class="iconFolderSelected" v-if="selectedFolder === null"></i>
                  <i class="ri-folders-line" v-else ></i> 
                  <span>{{$t('sidebar.all')}}</span>
            </a>

            <a @click="setDue()" v-if="settings.hasDueFolder"
              :class="[
                'rmli-sidebar-folder', 
                {'rmli-sidebar-folder-selected': selectedFolder && selectedFolder.isDue}
                ]"
                >
                  <i class="ri-alarm-line" ></i> 
                  <span>{{$t('sidebar.due')}}</span>
            </a>

             <a @click="setTodo()" v-if="settings.hasTodoFolder"
              :class="[
                'rmli-sidebar-folder', 
                {'rmli-sidebar-folder-selected': selectedFolder && selectedFolder.isTodo }
                ]"
                >
                  <i class="ri-checkbox-multiple-line" ></i> 
                  <span>{{$t('sidebar.todos')}}</span>
            </a>

            <a @click="setFolder(folder)" @dblclick="showEditFolder(folder)"
                :class="[
                  'rmli-sidebar-folder', 
                  {'rmli-sidebar-folder-selected': selectedFolder && selectedFolder.id === folder.id }, 
                  {'rmli-sidebar-folder-dnd': dropFolder && dropFolder.id === folder.id }
                ]" 
                v-for="folder in file.content.folders" 
                @dragover="onDragOver(folder, $event)"
                @dragleave="onDragLeave(folder, $event)"
                @drop="onDrop(folder, $event)"
                :key="folder.id">
                  <i :class="iconFolderSelected" v-if="selectedFolder && selectedFolder.id === folder.id"></i>
                  <i class="ri-folder-line" v-else></i> 
                  
                  <span v-if="!editFolder || editFolder.id !== folder.id">
                      {{folder.label}}
                  </span>
                  <input 
                    v-else
                    :placeholder="$t('sidebar.delete')"
                    class="rmli-inline-edit" 
                    v-model="editFolderName" 
                    @blur="changeFolder" 
                    ref="editFolderInput"
                  />
            </a>

            <a class="rmli-sidebar-folder  rmli-sidebar-folder-add" v-if="hasNewFolderInput" >
                 
                  <i class="ri-folder-add-line" ></i> 
                  <input 
                    
                    :placeholder="$t('sidebar.newplaceholder')"
                    class="rmli-inline-edit" 
                    v-model="newFolderName" 
                    @blur="createNewFolder" 
                    ref="newFolderInput"
                  />
            </a>

            <a class="rmli-sidebar-folder rmli-sidebar-folder-add " v-if="!hasNewFolderInput" @click="showNewFolder">
                <i class="ri-folder-add-line" v-if="false"></i> 
                <span class="rmli-sidebar-hint ">
                      {{$t('sidebar.addFolder')}}
                </span>
            </a>

        
        </div>


        <div class="rmli-sidebar-list rmli-sidebar-menu">
            <div class="rmli-sidebar-section-header">
               <span>{{$t('sidebar.menu')}}</span>   
             </div>

            <SidebarActions @help="onHelp" @settings="onSettings" @exit="onExit"/>
             
        </div>
       

    </div>
  
    
  </div>
</template>

<style lang="scss">
  @import '../scss/sidebar.scss';
</style>
<script>
import Logger from '../util/Logger'
import {TERMS} from '../services/RememberLi'
import SidebarActions from '../desktop/SidebarActions.vue'

export default {
  name: 'SideBar',
  emits: [
      'save', 'select', 'search', 'new', 'exit', 'setFolder', 'deleteFolder', 
      'createFolder', 'changeFolder', 'deleteFolder', 'settings', 'moveElementToFolder', 'help'
  ],
  props: ['file', 'isDirty', 'hasMenu', 'settings'],
  data: function () {
    return {
        iconFolderSelected: 'ri-folder-open-line', //'ri-folder-4-line',
        hasNewFolderInput: false,
        newFolderName: '',
        selectedFolder: null,
        editFolder: null,
        dropFolder: null,
        editFolderName: null,
        isDue: false,
        allFolder: {
          isAll: true,
          id:'',
          label:'All'
        },
        dueFolder: {
          isDue: true,
          id:'',
          label:'Due'
        },
        todoFolder: {
          isTodo: true,
          id:'',
          label:'Todo'
        },
        hasDueFilter: false
    }
  },
  components: {
    SidebarActions
  },
  computed: {
    folderDueCount () {
      Logger.log(3, 'SideBar.folderDueCount()')
      let result = {}
      if (this.file) {
        this.file.content.elemenents.forEach(e => {
           e //
        })
      }
      return result
    }
  },
  methods: {
    onDragOver (folder, e) {
      Logger.log(3, 'SideBar.onDragOver()', folder.label, e)
      e.preventDefault()
      this.dropFolder = folder
    },
    onDragLeave () {
      this.dropFolder = null
    },
    onDrop (folder, e) {
      Logger.log(3, 'SideBar.onDrop()', folder, e)
      this.dropFolder = null
      if (e && e.dataTransfer) {
        e.preventDefault();
        var elementId = e.dataTransfer.getData("text");
        this.$emit('moveElementToFolder', folder, elementId)
      }
    },
    showEditFolder (folder) {
      Logger.log(3, 'SideBar.showEditFolder()', folder)
      this.editFolder = folder
      this.editFolderName = folder.label
      this.$nextTick(() => {
        this.$refs.editFolderInput[0].focus()
        this.$refs.editFolderInput[0].select()
      })
    },
    changeFolder () {
      Logger.log(3, 'SideBar.changeFolder()', this.editFolderName)
      if (this.editFolderName.trim()) {
        this.$emit('changeFolder', this.editFolder.id, this.editFolderName)
      } else {
        this.$emit('deleteFolder', this.editFolder.id, '')
      }
      this.editFolder = null
      this.editFolderName = ''
    },
    setDue () {
      this.isDue = true
      this.$emit('search', TERMS.DUE)
      this.selectedFolder = this.dueFolder
      this.$emit('setFolder', null)
    },
    setTodo () {
      this.isDue = true
      this.$emit('search', TERMS.TODO)
      this.selectedFolder = this.todoFolder
      this.$emit('setFolder', null)
    },
    setSearch (query) {
      Logger.log(3, 'SideBar.setSearch()', query)
      this.$emit('search', query)
    },
    setFolder (folder) {
      Logger.log(3, 'SideBar.setFolder()', folder)
      this.selectedFolder = folder
      if (this.isDue) {
        this.$emit('search', '')
      }
      this.isDue = false
      this.$emit('setFolder', folder)
    },
    showNewFolder () {
      Logger.log(3, 'SideBar.createNewFolder()')
      this.hasNewFolderInput = true
      this.$nextTick(() => {
        this.$refs.newFolderInput.focus()
      })
    },
    createNewFolder () {
      Logger.log(3, 'SideBar.createNewFolder() > ', this.newFolderName)
      this.hasNewFolderInput = false
      if (this.newFolderName) {
        this.$emit('createFolder', this.newFolderName)
      }
      this.newFolderName = ''
    },
    onNewFile () {
      this.$emit('new')
    },
    onSave () {
      this.$emit('save')
    },
    onSelect () {
      this.$emit('select')
    },
    onExit () {
      this.$emit('exit')
    },
    onSettings () {
      Logger.log(3, 'SideBar.onSettings()')
      this.$emit('settings')
    },
    onHelp () {
      Logger.log(3, 'SideBar.onHelp()')
      this.$emit('help')
    },
    onAbout () {
      Logger.log(3, 'SideBar.onAbout()')
    }
  },
  mounted () {
  }
}
</script>
