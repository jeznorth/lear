<template>
  <div id="annual-report">
    <h1 id="AR-header">{{year}} Annual Report - <span style="font-style: italic">{{ reportState }}</span></h1>
    <div v-if="filedDate == null">
      <p>Review and certify your {{year}} Annual Report information.</p>
      <section>
        <h2>1. Enter your Annual General Meeting Date</h2>
        <v-card>
          <AGMDate/>
        </v-card>
      </section>
    </div>
    <div v-else>
      <ARComplete/>
    </div>
  </div>
</template>

<script>
import AGMDate from '@/components/ARSteps/AGMDate.vue'
import ARComplete from '@/components/ARSteps/ARComplete.vue'

export default {
  name: 'AnnualReport.vue',
  components: {
    AGMDate,
    ARComplete
  },
  computed: {
    filedDate () {
      return this.$store.state.filedDate
    },
    year () {
      return this.$store.state.ARFilingYear
    },
    reportState () {
      if (this.filedDate) return 'Filed'
      else return 'Draft'
    }
  },
  methods: {
  },
  watch: {
  }
}
</script>

<style lang="stylus" scoped>
h1, h2
  margin-bottom 1.5rem

@media (min-width 768px)
  h1
    margin-bottom 2rem

  .intro-text
    margin-bottom 3rem
    font-size 1.125rem

</style>
