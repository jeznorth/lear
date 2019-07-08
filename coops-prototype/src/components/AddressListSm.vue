<template>
  <ul class="list">
    <li class="list-item">
      <v-icon color="primary">mail_outline</v-icon>
      <div class="address">
        <div class="list-item__title">Mailing Address</div>
        <div class="list-item__subtitle">
          <ul class="address-details">
            <li>{{ mailingAddress.street }}</li>
            <li>{{ mailingAddress.city }}  {{ mailingAddress.region }}&nbsp;&nbsp;{{ mailingAddress.postalCode}}</li>
            <li>{{ mailingAddress.country }}</li>
          </ul>
        </div>
      </div>
    </li>
    <li class="list-item">
      <v-icon color="primary">local_shipping</v-icon>
      <div class="address">
        <div class="list-item__title">Delivery Address</div>
        <div class="list-item__subtitle">
          <ul class="address-details">
            <li>{{ deliveryAddress.street }}</li>
            <li>{{ deliveryAddress.city }}  {{ deliveryAddress.region }}&nbsp;&nbsp;{{ deliveryAddress.postalCode}}</li>
            <li>{{ deliveryAddress.country }}</li>
          </ul>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'addressListSm',

  // Placeholder Data
  data () {
    return {
      mailingAddress: {
        street: '1234 Main Street',
        city: 'Victoria',
        country: 'Canada',
        region: 'BC',
        postalCode: 'V0G 1Y0'
      },

      deliveryAddress: {
        inherit: false,
        street: '1234 Main Street',
        city: 'Victoria',
        country: 'Canada',
        region: 'BC',
        postalCode: 'V0G 1Y0'
      }
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
    align-items flex-start

  .v-icon 
    margin-right 1.25rem
</style>