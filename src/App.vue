<template>
  <div class="rmli-drag-bar" data-tauri-drag-region style=""/>

    <router-view/>

</template>


<style lang="scss">
  @use './scss/app.scss';
  @use './scss/layout.scss';
</style>

<script>
import 'remixicon/fonts/remixicon.css'
export default {
  name: 'App',
  data: function () {
    return {
    }
  }
}
</script>

