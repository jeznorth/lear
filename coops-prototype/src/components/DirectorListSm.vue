<template>
  <ul class="list">
    <li class="list-item" v-for="director in directors" v-bind:key="director.id">
      <div class="list-item-title">{{ director.firstName }} {{ director.lastName }}</div>
      <!-- <div class="list-item-subtitle">MMM DD, YYYY</div> -->
    </li>
  </ul>
</template>

<script>
export default {
  name: 'DirectorListSm',

  // Placeholder Data
  data () {
    return {
      mailingAddress: {
        street: '1234 Main Street',
        city: 'Victoria',
        country: 'Canada',
        region: 'BC'
      },

      deliveryAddress: {
        inherit: false,
        street: '1234 Main Street',
        city: 'Victoria',
        country: 'Canada',
        region: 'BC'
      },

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
  .list .list-item
    flex-directon column
</style>