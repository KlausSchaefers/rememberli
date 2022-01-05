<template>
  <div id="nav">
    <textarea v-model="content.value"/>
    <button @click="save">Save</button>
  </div>
  <router-view/>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


</style>

<script>
//import { ipcRenderer } from 'electron'

export default {
  name: 'App',
  data: function () {
      return {
           content: {
             value : 'hello'
           }
		
    }
  },
  methods: {
    save () {
      console.debug('save()', this.content)
      let ipcRenderer = window.ipcRenderer
      ipcRenderer.send('save', JSON.stringify(this.content, null, 2))
    }
  },
  mounted () {
    window.ipcRenderer.receive('save:reply', (e) => {
      console.debug('mounted() save:reply', e)
    })
  }
}
</script>

