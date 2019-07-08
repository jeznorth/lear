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
              <h2>Current Directors</h2>
              <director-list-sm layout="card"></director-list-sm>
            </section>
            <section>
              <h2>Office Addresses</h2>
              <v-card flat>
              <address-list-sm></address-list-sm>
              </v-card>
            </section>
           
           <!--
            <section>
              <h2>To Do <span class="text-muted">({{ this.toDoListTotal }})</span></h2>
              <ToDoList @todolength="showToDoListCount"></ToDoList>
            </section>
            <section>
              <h2>Recent Filing History <span class="text-muted">({{ this.filingHistoryListTotal }})</span></h2>
              <FilingHistoryList @filingCount="showFilingCount"></FilingHistoryList>
            </section>
            -->

          </div>

          <aside class="dashboard-content__aside">
            <section>
              <h2>To Do</h2>
              <v-card flat>
                <ToDoList @todolength="showToDoListCount"></ToDoList>
              </v-card>
            </section>
            <section>
              <h2>Recent Filing History</h2>
              <v-card flat>
                <FilingHistoryList @filingCount="showFilingCount"></FilingHistoryList>
              </v-card>
            </section>
          </aside>
          
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
  import FilingHistoryList from '@/components/FilingHistoryList.vue'
  import ToDoList from '@/components/ToDoList.vue'
  import Vue2Filters from 'vue2-filters'

  Vue.use(Vue2Filters)

  export default {
    name: "DashboardAlt",
    mixins: [Vue2Filters.mixin],
    components: {
      AddressListSm,
      DirectorListSm,
      EntityInfo,
      FilingHistoryList,
      ToDoList
    },

    data () {
      return {
        filingHistoryListTotal: '',
        toDoListTotal: '',

        showLoading: false,
        loadingMsg: 'Preparing your Annual Report',
      }
    },

    methods: {
      showToDoListCount(value) {
        this.toDoListTotal = value
      },

      showFilingCount(value) {
        this.filingHistoryListTotal = value
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../assets/styles/theme.styl"

  // Dashboard Layout
  h1
    margin-bottom 0

  h2 
    font-weight 700

  .dashboard-content
    display flex
    margin -1rem
    justify-content space-evenly

  .dashboard-content__main
    flex 1 1 auto
    margin 1rem

  .dashboard-content__aside
    flex 1 1 auto
    margin 1rem
</style>
