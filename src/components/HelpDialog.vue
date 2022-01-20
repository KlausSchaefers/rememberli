<template>
  <RDialog ref="dialog">
      <div class="rmli-help">

            <div class="rmli-tab-bar">
                <a :class="{'rmli-tab-active': tab=== 'help'}" @click="tab = 'help'">{{ $t('help.help')}}</a>
                <a :class="{'rmli-tab-active': tab=== 'tos'}" @click="tab = 'tos'">{{ $t('help.tos')}}</a>
                <a :class="{'rmli-tab-active': tab=== 'about'}" @click="tab = 'about'">{{ $t('help.about')}}</a>
            </div>

            <div class="rmli-dialog-content-m" v-if="tab ==='help'">
                <p>
                    RememberLi is a simple note-taking app, that will help you to remember 
                    the important things. The app is built around three main 
                    concepts to organize and find your notes:
                </p>

                <h3>Concepts</h3>
                 <p>
                    The app is built around three main 
                    concepts to organize and find your notes:
                </p>
                <ol>
                    <li>The powerful search allows you to find and filter all your notes</li>
                    <li>Use <span class="rmi-highlight-person">@person</span> and <span class="rmi-highlight-tag">#tag</span> 
                    markup to highlight important things. The serach has autocomplete for your tags!</li>
                    <li>You can place your notes into folders</li>
                </ol>

                <p>
                    In addition, you pin notes to the top to be always in the field of 
                    view when the app is loaded. You can also set reminders. 
                    When a note is due, it will be indicated with a red bar.
                </p>

                <h3>Creating and editing a note:</h3>
                 <p>
                    Simply click into the "Add new note field" and start typing. Once you are done, 
                    the new note is added to the list of notes. You can always edit the notes afterward.
                </p>

                <p>
                    RememberLi supports the following markups that make it easy for you to organize your notes:
                </p>

                <ol>
                    <li><b>@name</b>: Create a person markup</li>
                    <li><b>#tag</b>: Create a tag markup</li>
                    <li><b>[]</b>: Create a open task checkbox</li>
                    <li><b>[X]</b>: Create on closed markup checkbox</li>
                    <li><b>-></b>: Create an arrow</li>
                </ol>

                <p>
                    To delete a note, simply remove all content.
                </p>

                <h3>Fodlers</h3>
                <p>
                     The view the folders click on the <i class="ri-menu-line"></i> icon to open the sidebar.
                     You will always see an "All notes" folder which allows you to see all your notes. To create
                     a new folder:
                      
                </p>

                <ol>
                    <li>Hover over the sidebar</li>
                    <li>Click on the  <i class="ri-add-line" /> icon. </li>
                    <li>Enter the name</li>
                </ol>

                 <p>
                    You can now select the new folder, and add notes to it. To change the name of the folder, double click it. 
                    To remove the folder, delete the name while editing.
                </p>

            </div>


            <div  class="rmli-dialog-content-m" v-if="tab ==='about'">
                <p>
                    This software was is inspired by my wonderful wife Li.
                </p>

                <p>
                    If you like RemeberLi, please give me a star at our page https://github.com/KlausSchaefers/rememberli
                </p>
                
            </div>

            <div  class="rmli-dialog-content-m" v-if="tab ==='tos'">
                <p>
                Copyright 2022 Klaus Schaefers
                </p>

                <p>
                    Permission is hereby granted, free of charge, to any person obtaining 
                    a copy of this software and associated documentation files (the "Software"), 
                    to deal in the Software without restriction, including without 
                    limitation the rights to use, copy, modify, merge, publish, 
                    distribute, sublicense, and/or sell copies of the Software, 
                    and to permit persons to whom the Software is furnished to do 
                    so, subject to the following conditions:
                </p>

                <p>
                     The above copyright notice and this permission notice shall be included 
                    in all copies or substantial portions of the Software.
                </p>

                 <p>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
                    INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                    PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
                    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR 
                    OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
                    ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
                    OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                </p>
                   

            </div>
        
            
            <div class="rmli-button-bar">
                <button class="rmli-button" @click="cancel">{{$t('common.close')}}</button>
            </div>
        </div>
  </RDialog>
</template>

<style lang="scss">
  @import '../scss/tab.scss';
  @import '../scss/help.scss';
</style>
<script>

import RDialog from '../common/Dialog.vue'
import Logger from '../util/Logger'
//import Util from '../util/Util'

export default {
  name: 'HelpDialog',
  emits: [],
  props: [],
  data: function () {
    return {
        tab: 'help'
    }
  },
  components: {
    RDialog
  },
  methods: {
    show () {
      Logger.log(-1, 'HelpDialog.show()')
      this.$refs.dialog.show()
    },
    cancel () {
      Logger.log(-1, 'HelpDialog.cancel()')
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
