<template>
  <RDialog ref="dialog" size="m">
      <div class="rmli-help">

            <div class="rmli-tab-bar">
                <a :class="{'rmli-tab-active': tab=== 'help'}" @click="tab = 'help'">{{ $t('help.help')}}</a>
                <a :class="{'rmli-tab-active': tab=== 'contact'}" @click="tab = 'contact'">{{ $t('help.contact')}}</a>
                <a :class="{'rmli-tab-active': tab=== 'tos'}" @click="tab = 'tos'">{{ $t('help.tos')}}</a>
                <a :class="{'rmli-tab-active': tab=== 'about'}" @click="tab = 'about'">{{ $t('help.about')}}</a>
            </div>

            <div class="rmli-dialog-content-m" v-if="tab ==='help'">
                <p>
                    RememberLi is a simple note-taking app, that will help you to remember 
                    the important things.
                </p>

                <h3>Concepts</h3>
                 <p>
                    The app is built around three main 
                    concepts to organize:
                </p>
                <ol>
                    <li>The powerful search allows you to find and filter all your notes. </li>
                    <li>Use <span class="rmi-highlight-person">@person</span> and <span class="rmi-highlight-tag">#tag</span> 
                    markup to highlight important things. </li>
                   
                    <li>Place your notes into folders</li>
                </ol>

                <p>
                    In addition, you pin notes to the top to be always in the field of 
                    view when the app is loaded. You can also set reminders. 
                    When a note is due, it will be indicated with a red bar.
                </p>

                <h3>Notes:</h3>
                 <p>
                    Simply click into the "Add new note" field and start typing. Once you are done, 
                    the new note is added to the list of notes. You can always edit the notes afterward.
                </p>

                <p>
                    RememberLi supports the following markups that make it easy for you to organize your notes:
                </p>

                <ul>
                    <li><b>@name</b>: Create a <span class="rmi-highlight-person">@person</span>  markup</li>
                    <li><b>#tag</b>: Create a and <span class="rmi-highlight-tag">#tag</span> markup</li>
                    <li><b>[]</b>: Create a open task checkbox <span class="rmi-highlight-task rmi-highlight-task-open"></span></li>
                    <li><b>[X]</b>: Create on closed markup checkbox <span class="rmi-highlight-task rmi-highlight-task-done"></span></li>
                    <li><b>-></b>: Create an <i class="ri-arrow-right-line rmi-highlight-icon"></i></li>
                </ul>

                <p>
                    To delete a note, simply remove all content.
                </p>

                <h3>Reminders:</h3>
                 <p>
                    You can set a remimnder for every note. When the reminder gets due, the note will be indicated with a red border
                    at the left side. To create a reminder follow these steps:


                    <ol>
                        <li>Click on the <i class="ri-more-line rmli-help-example-icon"/> icon </li>
                        <li>Select the  <i class="ri-alarm-line rmli-help-example-icon"></i> {{$t('note.setreminder')}} entry in the menu.  </li>
                        <li>A dialog will show up. You can now set the date, when the note should become due. </li>
                        <li>You can change or remove the reminder by opening the dialog again.</li>
                    </ol>



                </p>

                <h3>Folders</h3>
                <p>
                     To view the folders, click on the <i class="ri-menu-line rmli-help-example-icon"></i> icon to open the sidebar.
                     You will always see an "All notes" folder which allows you to see all your notes. To create
                     a new folder:
                      
                </p>

                <ol>
                    <li>Hover over the sidebar</li>
                    <li>Click on the  <i class="ri-add-line rmli-help-example-icon" /> icon. </li>
                    <li>Enter the name</li>
                </ol>

                 <p>
                    You can now select the new folder, and add notes to it. To change the name of the folder, double click it. 
                    To remove the folder, delete the name while editing.
                </p>

               


            </div>


            <div  class="rmli-dialog-content-m" v-if="tab ==='contact'">

                

                <h3>Contact</h3>
                <p>
                    Join our <a href="https://discord.gg/4GcrjfpXem" class="rmli-link">Discord</a> channel for support.
                </p>

                <h3>OpenSource</h3>
                <p>
                    RememberLi is free and open source. If you like the project, please give me a star at the 
                    <a class="rmli-link" href="https://github.com/KlausSchaefers/rememberli" @click="onLink"> Github </a> page.
                </p>

                <h3>Bugs</h3>
                <p>
                    Please, report bugs at the
                    <a class="rmli-link" href="https://github.com/KlausSchaefers/rememberli" @click="onLink"> Github </a> page. 
                </p>
                
              
            </div>

            <div  class="rmli-dialog-content-m rmli-help-about" v-if="tab ==='about'">
                <Logo />
         
                    <div class="">
                        This software was inspired by my wonderful wife Liliana.
                    </div>
                    
           
                <span class="rmli-margin-top-l rmli-secondary-label">Version: {{version}} </span>
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
import Logo from '../components/Logo'

export default {
  name: 'HelpDialog',
  emits: ['openWebLink'],
  props: ['version'],
  data: function () {
    return {
        tab: 'help'
    }
  },
  components: {
    RDialog, Logo
  },
  methods: {
    show () {
      Logger.log(-1, 'HelpDialog.show()')
      this.$refs.dialog.show()
    },
    onLink (e) {
        this.$emit('openWebLink', e)
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
