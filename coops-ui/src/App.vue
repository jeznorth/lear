<template>
  <v-app class="app-container" id="app">
    <std-header></std-header>
    <main>
      <router-view/>
    </main>
  </v-app>
</template>

<script>
import StdHeader from '@/components/StdHeader.vue'

export default {
  name: 'home',
  components: {
    StdHeader
  }
}
</script>

<style lang="stylus">
  @import "./assets/styles/base.styl";
  @import "./assets/styles/layout.styl";
  @import "./assets/styles/overrides.styl";
</style>
