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
        <section>
          <h2>To Do <span class="text-muted">({{todoItems.length}})</span></h2>
          <v-card>
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
          <h2>Recent Filing History <span class="text-muted">({{filedItems.length}})</span></h2>
          <v-card>
            <v-expansion-panel>
              <v-expansion-panel-content
                class="filing-history-list"
                v-for="(item, index) in orderBy(filedItems, 'name', 1)"
                v-bind:key="index">
                <template v-slot:header>
                  <div class="list-item">
                    <div class="list-item-title">{{item.name}}</div>
                    <div class="list-item-subtitle">Filed by {{item.filingAuthor}} on {{item.filingDate}}</div>
                  </div>
                </template>
                <ul class="list document-list">
                  <li class="list-item"
                    v-for="(document, index) in orderBy(item.filingDocuments, 'name', 1)"
                    v-bind:key="index">
                    <a href="#">
                      <img class="list-item-icon" src="@/assets/images/icons/file-pdf-outline.svg" />
                      <div class="list-item-title">
                        {{document.name}}
                      </div>
                    </a>
                  </li>
                  <li class="list-item">
                    <a href="#">
                      <img class="list-item-icon" src="@/assets/images/icons/file-pdf-outline.svg" />
                      <div class="list-item-title">
                        Receipt
                      </div>
                    </a>
                  </li>
                </ul>
                <div class="documents-actions-bar">
                  <v-btn class="download-all-btn" color="primary">Download All</v-btn>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>
        </section>
      </article>
    </v-container>
  </div>
</template>

<script lang='ts'>
  import { Component, Vue } from 'vue-property-decorator'
  import EntityInfo from '@/components/EntityInfo.vue'
  import Vue2Filters from 'vue2-filters'

  Vue.use(Vue2Filters)

  export default {
    name: "Dashboard",
    mixins: [Vue2Filters.mixin],
    components: {
      EntityInfo,
    },

    data () {
      return {
        todoItems: [
          { name: 'File 2018 Annual Report', enabled: true },
          { name: 'File 2019 Annual Report', enabled: true },
        ],

        filedItems: [
          { name: 'Annual Report (2017)',
            filingAuthor: 'Jane Doe',
            filingDate: 'Feb 01, 2018',
            filingStatus: 'Complete',
            filingDocuments: [
              { name: 'Change of Address' },
              { name: 'Change of Directors' },
              { name: 'Annual Report'},
            ]
          },
          { name: 'Annual Report (2016)',
            filingAuthor: 'Jane Doe',
            filingDate: 'Feb 05, 2017',
            filingStatus: 'Complete',
            filingDocuments: [
              { name: 'Change of Address' },
              { name: 'Change of Directors' },
              { name: 'Annual Report'},
            ]
          },
          { name: 'Annual Report (2015)',
            filingAuthor: 'Jane Doe',
            filingDate: 'Feb 07, 2016',
            filingStatus: 'Complete',
            filingDocuments: [
              { name: 'Change of Address' },
              { name: 'Change of Directors' },
              { name: 'Annual Report'},
            ]
          },
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

  // TODO: Create/Move to Helper Stylesheet
  .text-muted
    color $gray5

  // Common
  .list
    margin 0
    padding 0
    list-style-type none

  .list-item
    display flex
    flex-direction row
    align-items center
    padding 1.25rem
    background #fff
    font-size 0.875rem

  .list-item + .list-item
    border-top 1px solid $gray3

  .list-item-icon
    margin-top -1px
    margin-right 0.5rem
    opacity 0.4

  .list-item-title
    font-weight 700

  .list-item-subtitle
    color $gray5
    font-weight 400

  .list-item-actions
    flex 0 0 auto
    margin-left auto

    .v-btn
      margin 0
      min-width 8rem
      font-weight 500

  // Filing History
  .filing-history-list .list-item
    flex-direction column
    align-items flex-start
    padding 0

  // Document List
  .document-list
    border-top 1px solid $gray3

    .list-item a
      display flex
      flex-direction row
      align-items center
      padding 0.5rem

    .list-item-title
      font-weight 400

  // Documents Action Bar
  .documents-actions-bar
    padding-top 1rem
    padding-bottom 1.25rem
    display flex
    border-top 1px solid $gray3

    .v-btn
      margin-right 0

  .download-all-btn
    margin-left auto
    min-width 8rem
</style>
