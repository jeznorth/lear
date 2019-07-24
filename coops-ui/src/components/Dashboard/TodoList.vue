<template>
  <div v-if="todoItems">
    <v-card flat>
      <ul class="list todo-list">
        <li class="list-item"
          v-for="(item, index) in orderBy(todoItems, 'year', 1)"
          v-bind:key="index">
          <div class="list-item-title">{{item.name}}</div>
          <div class="list-item-actions">
            <v-btn color="primary" @click="fileAnnualReport(item)" :disabled="!item.enabled">File Now</v-btn>
          </div>
        </li>
      </ul>
    </v-card>

     <!-- No Results Message -->
    <v-card class="no-results" flat v-if="todoItems.length === 0">
      <v-card-text>
        <div class="no-results__title">You don't have anything to do yet</div>
        <div class="no-results__subtitle">Filings that require your attention will appear here</div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue2Filters from 'vue2-filters'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'TodoList',

  mixins: [Vue2Filters.mixin],

  data () {
    return {
      todoItems: null
    }
  },

  computed: {
    ...mapState(['currentDate', 'lastAgmDate'])
  },

  mounted () {
    // reload data for this page
    this.getTodoItems()
  },

  methods: {
    ...mapActions(['setARFilingYear', 'setCurrentARStatus', 'setRegOffAddrChange', 'setAgmDate',
      'setFiledDate', 'setNoAGM', 'setValidated']),

    getTodoItems () {
      this.todoItems = []
      if (this.currentDate && this.lastAgmDate) {
        const currentYear = +this.currentDate.substring(0, 4)
        const lastAgmYear = +this.lastAgmDate.substring(0, 4)
        // create items for past years
        for (let year = (lastAgmYear + 1); year < currentYear; year++) {
          this.todoItems.push({
            name: `File ${year} Annual Report`,
            year: year,
            enabled: false
          })
        }
        // create item for this year
        if (this.lastAgmDate < this.currentDate) {
          this.todoItems.push({
            name: `File ${currentYear} Annual Report`,
            year: currentYear,
            enabled: false
          })
        }
        // enable earliest AR
        if (this.todoItems.length > 0) {
          this.todoItems[0].enabled = true
        }
        this.$emit('todo-count', this.todoItems.length)
      }
    },
    fileAnnualReport (item) {
      this.resetStore(item)
      this.$router.push('/annual-report')
    },
    resetStore (item) {
      this.setARFilingYear(item.year)
      this.setCurrentARStatus('TODO')
      this.setRegOffAddrChange(false)
      this.setAgmDate(null)
      this.setFiledDate(null)
      this.setNoAGM(false)
      this.setValidated(false)
    }
  },

  watch: {
    currentDate (val) {
      // when Current Date is set or changes, get new todo items
      this.getTodoItems()
    },
    lastAgmDate (val) {
      // when Last AGM Date is set or changes, get new todo items
      this.getTodoItems()
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../../assets/styles/theme.styl"
</style>