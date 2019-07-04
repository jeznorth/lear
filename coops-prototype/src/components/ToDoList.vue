<template>
  <div>
    <v-card flat>
      <ul class="list todo-list">
        <li class="list-item"
          v-for="(item, index) in orderBy(toDoItems, 'name', 1)"
          v-bind:key="index">
          <div class="list-item__title">{{item.name}}</div>
          <div class="list-item-actions">
            <v-btn color="primary" @click="fileAnnualReport" :disabled="!item.enabled">File Now</v-btn>
          </div>
        </li>
      </ul>
    </v-card>

    <!-- No Results Message -->
    <!-- We could probably make this into a reusable component -->
    <v-card class="no-results" flat v-if="toDoItems.length === 0">
      <v-card-text>
        <div class="no-results__title">You don't have anything to do yet</div>
        <div class="no-results__subtitle">Filings that require your attention will appear here</div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
  import Vue2Filters from 'vue2-filters'

  export default {
    name: 'toDoList',
    mixins: [Vue2Filters.mixin],

    data () {
      return {
        toDoItems: [
          { name: 'File 2018 Annual Report', enabled: true },
          { name: 'File 2019 Annual Report', enabled: true },
        ]
      }
    },

    methods: {
      gotoAnnualReport: function () {
        this.$router.push({ path: '/AnnualReport' })
      },

      fileAnnualReport: function () {
        this.showLoading = true
        setTimeout(() => { this.gotoAnnualReport() })
      },
    },

    created: function () {
      this.$emit('todolength', this.toDoItems.length)
    }
  }
</script>

<style lang="stylus" scoped>
  // Styles Here
</style>