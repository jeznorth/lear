<template>
  <div>
    <v-fade-transition>
      <div class="loading-container" v-show="showLoading">
        <div class="loading__content">
          <v-progress-circular color="primary" :size="50" indeterminate></v-progress-circular>
          <div class="loading-msg">{{this.loadingMsg}}</div>
        </div>
      </div>
    </v-fade-transition>
    <EntityInfo/>
    <v-container class="view-container">
      <article>
        <header>
          <h1>Dashboard</h1>
        </header>
        <div class="dashboard-content">
          <div class="dashboard-content__main">
            <section>
              <h2>To Do <span class="text-muted">({{todoItems.length}})</span></h2>
              <v-card flat>
                <ul class="list todo-list">
                  <li class="list-item"
                    v-for="(item, index) in orderBy(todoItems, 'name', 1)"
                    v-bind:key="index">
                    <div class="list-item-title">{{item.name}}</div>
                    <div class="list-item-actions">
                      <v-btn color="primary" @click="fileAnnualReport" :disabled="!item.enabled">File Now</v-btn>
                    </div>
                  </li>
                </ul>
              </v-card>
            </section>
            <section>
              <h2>Recent Filing History <span class="text-muted"></span></h2>
              <filing-history @clicked="onClickChild"></filing-history>
            </section>
          </div>
          <!--
          <aside class="dashboard-content__aside">
            <section>
              <h2>Registered Office Addresses</h2>
              <v-card flat>
                <address-list-sm></address-list-sm>
              </v-card>
            </section>
            <section>
              <h2>Current Directors</h2>
              <v-card flat>
                <director-list-sm></director-list-sm>
              </v-card>
            </section>
          </aside>
          -->
        </div>
      </article>
    </v-container>
  </div>
</template>

<script lang='ts'>
  import { Component, Vue } from 'vue-property-decorator'
  import AddressListSm from '@/components/AddressListSm.vue'
  import DirectorListSm from '@/components/DirectorListSm.vue'
  import EntityInfo from '@/components/EntityInfo.vue'
  import FilingHistory from '@/components/FilingHistory.vue'
  import Vue2Filters from 'vue2-filters'

  Vue.use(Vue2Filters)

  export default {
    name: "Dashboard",
    mixins: [Vue2Filters.mixin],
    components: {
      AddressListSm,
      DirectorListSm,
      EntityInfo,
      FilingHistory
    },

    data () {
      return {
        todoItems: [
          { name: 'File 2018 Annual Report', enabled: true },
          { name: 'File 2019 Annual Report', enabled: true },
        ],

        showLoading: false,
        loadingMsg: 'Preparing your Annual Report'
      }
    },

    methods: {
      gotoAnnualReport: function () {
        this.$router.push({ path: '/AnnualReport' })
      },

      fileAnnualReport: function () {
        this.showLoading = true
        setTimeout(() => { this.gotoAnnualReport() })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../assets/styles/theme.styl"

  // Dashboard Layout
  h1
    margin-bottom 0

  .dashboard-content
    display flex

  .dashboard-content__main
    flex 1 1 auto

  .dashboard-content__aside
    margin-left 2rem
</style>
