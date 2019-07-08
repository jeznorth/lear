<template>
  <ul class="list" :class="layout">
    <li class="list-item" v-for="director in directors" v-bind:key="director.id">
      <v-avatar color="grey lighten-1" size="32">
        <span class="white--text title">{{ director.firstName.substring(0,1)}}</span>
      </v-avatar>
      <div class="director-info">
        <div class="list-item__title">{{ director.firstName }} {{ director.lastName }}</div>
        <!--
        <div class="list-item__subtitle">
          <ul class="address-details">
            <li>{{ director.street }}</li>
            <li>{{ director.city }}  {{ director.region }}&nbsp;&nbsp;{{ director.postalCode}}</li>
            <li>{{ director.country }}</li>
          </ul>
        </div>
        -->
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'DirectorListSm',
  props: {
    layout: String
  },

  // Placeholder Data
  data () {
    return {
      directors: [
        { id: 1, isNew: false, isDirectorActive: true, firstName: "Jon", lastName: "Lee", initial: "", street: "14 Maple Street", city: "Vancouver", region: "BC", postalCode: "V7L 2W9", country: "Canada"},
        { id: 2, isNew: false, isDirectorActive: true, firstName: "Alli", lastName: "Myers", initial: "", street: "1111 First Street", city: "Victoria", region: "BC", postalCode: "V8A 2G8", country: "Canada"},
        { id: 3, isNew: false, isDirectorActive: true, firstName: "Nora", lastName: "Patton", initial: "", street: "2222 Second Street", city: "Victoria", region: "BC", postalCode: "V8A 2G8", country: "Canada"},
        { id: 4, isNew: false, isDirectorActive: true, firstName: "Phoebe", lastName: "Jones", initial: "", street: "3333 Third Street", city: "Victoria", region: "BC", postalCode: "V8A 2G8", country: "Canada"},
        { id: 5, isNew: false, isDirectorActive: true, firstName: "Cole", lastName: "Bryan", initial: "", street: "4444 Fourth Street", city: "Victoria", region: "BC", postalCode: "V8A 2G8", country: "Canada"}
      ]
    }
  }
}
</script>

<style lang="stylus" scoped>
  .address-details 
    padding 0
    list-style-type none 

  .list-item 
    flex-direction row
    align-items center
    background #ffffff

  .v-icon 
    margin-right 1rem

  .v-avatar 
    flex 0 0 auto
    margin-right 1.25rem

  .card 
    display flex
    flex-wrap wrap
    align-items flex-start

  .card .list-item
    flex 0 0 33.333333%
    border none
</style>