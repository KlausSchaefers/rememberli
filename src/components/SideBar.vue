<template>
  <div :class="'rmli-sidebar rmli-sidebar-' + (hasMenu ? 'closed' : 'open') ">

    <div class="rmli-sidebar-content rmli-drag-bar-below">
        
   
       

        <div class="rmli-sidebar-folder-list rmli-sidebar-list">

          <div class="rmli-sidebar-section-header">
               <span>{{$t('sidebar.folders')}}</span>
                <i class="ri-add-line rmli-folder-add rmli-tooltip" @click="showNewFolder" >
                    <span class="rmli-tooltip-message"> {{$t('sidebar.new')}}</span>
                </i> 
          </div>

           <a @click="setFolder(null)" :class="['rmli-sidebar-folder', {'rmli-sidebar-folder-selected': selectedFolder === null }]">
                  <i :class="iconFolderSelected" v-if="selectedFolder === null"></i>
                  <i class="ri-folder-line" v-else ></i> 
                  <span>{{$t('sidebar.all')}}</span>
            </a>

            <a @click="setSearch('due')" class="rmli-sidebar-folder" v-if="false">
                  <i class="ri-alarm-line" ></i> 
                  <span>{{$t('sidebar.due')}}</span>
            </a>

            <a @click="setFolder(folder)" @dblclick="showEditFolder(folder)"
                :class="['rmli-sidebar-folder', {'rmli-sidebar-folder-selected': selectedFolder && selectedFolder.id === folder.id }]" 
                v-for="folder in file.content.folders" 
                :key="folder.id">
                  <i :class="iconFolderSelected" v-if="selectedFolder && selectedFolder.id === folder.id"></i>
                  <i class="ri-folder-line" v-else></i> 
                  
                  <span v-if="!editFolder || editFolder.id !== folder.id">{{folder.label}}</span>
                  <input 
                    v-else
                    :placeholder="$t('sidebar.delete')"
                    class="rmli-inline-edit" 
                    v-model="editFolderName" 
                    @blur="changeFolder" 
                    ref="editFolderInput"
                  />
            </a>

             <a class="rmli-sidebar-folder rmli-sidebar-folder-add" v-if="hasNewFolderInput" >
                 
                  <i class="ri-folder-line" ></i> 
                  <input 
                    
                    :placeholder="$t('sidebar.newplaceholder')"
                    class="rmli-inline-edit" 
                    v-model="newFolderName" 
                    @blur="createNewFolder" 
                    ref="newFolderInput"
                  />
            </a>

        
        </div>


        <div class="rmli-sidebar-list rmli-sidebar-menu">
            <div class="rmli-sidebar-section-header">
               <span>{{$t('sidebar.menu')}}</span>   
             </div>

              <div class="rmli-sidebar-actions">
          
                <a @click="onExit">
                    <i class="ri-home-line"></i>
                    <span>{{$t('actions.home')}}</span>
                </a>

                <a @click="onSettings">
                    <i class="ri-sound-module-line"></i>
                    <span>{{$t('actions.settings')}}</span>
                </a>

                <a @click="onHelp">
                    <i class="ri-question-line"></i>
                    <span>{{$t('actions.help')}}</span>
                </a>
              </div>
        </div>
       

    </div>
  
    
  </div>
</template>

<style lang="scss">
  @import '../scss/sidebar.scss';
</style>
<script>
import Logger from '../util/Logger'

export default {
  name: 'SideBar',
  emits: ['save', 'select', 'search', 'new', 'exit', 'setFolder', 'deleteFolder', 'createFolder', 'changeFolder', 'deleteFolder', 'settings'],
  props: ['file', 'isDirty', 'hasMenu'],
  data: function () {
    return {
        iconFolderSelected: 'ri-folder-4-line',
        hasNewFolderInput: false,
        newFolderName: '',
        selectedFolder: null,
        editFolder: null,
        editFolderName: null
    }
  },
  components: {
  },
  methods: {
    showEditFolder (folder) {
      Logger.log(-3, 'SideBar.showEditFolder()', folder)
      this.editFolder = folder
      this.editFolderName = folder.label
      this.$nextTick(() => {
        this.$refs.editFolderInput[0].focus()
        this.$refs.editFolderInput[0].select()
      })
    },
    changeFolder () {
      Logger.log(-3, 'SideBar.changeFolder()', this.editFolderName)
      if (this.editFolderName.trim()) {
        this.$emit('changeFolder', this.editFolder.id, this.editFolderName)
      } else {
        this.$emit('deleteFolder', this.editFolder.id)
      }
      this.editFolder = null
      this.editFolderName = ''
    },
    setSearch (query) {
      Logger.log(-3, 'SideBar.setSearch()', query)
      this.$emit('search', query)
    },
    setFolder (folder) {
      Logger.log(-3, 'SideBar.setFolder()', folder)
      this.selectedFolder = folder
      this.$emit('setFolder', folder)
    },
    showNewFolder () {
      Logger.log(-3, 'SideBar.createNewFolder()')
      this.hasNewFolderInput = true
      this.$nextTick(() => {
        this.$refs.newFolderInput.focus()
      })
    },
    createNewFolder () {
      Logger.log(-3, 'SideBar.createNewFolder() > ', this.newFolderName)
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
      Logger.log(-3, 'SideBar.onSettings()')
      this.$emit('settings')
    },
    onHelp () {
      Logger.log(-3, 'SideBar.onHelp()')
    },
    onAbout () {
      Logger.log(-3, 'SideBar.onAbout()')
    }
  },
  mounted () {
  }
}
</script>
