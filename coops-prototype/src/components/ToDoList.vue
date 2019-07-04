<template>
  <v-card flat>
    <ul class="list todo-list">
      <li class="list-item"
        v-for="(item, index) in orderBy(toDoItems, 'name', 1)"
        v-bind:key="index">
        <div class="list-item-title">{{item.name}}</div>
        <div class="list-item-actions">
          <v-btn color="primary" @click="fileAnnualReport" :disabled="!item.enabled">File Now</v-btn>
        </div>
      </li>
    </ul>
  </v-card>
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

<style lang="stylus">
 // Styles go here
</style>