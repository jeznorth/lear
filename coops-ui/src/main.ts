import 'core-js/stable' // to polyfill ECMAScript features
import 'regenerator-runtime/runtime' // to use transpiled generator functions
import '@mdi/font/css/materialdesignicons.min.css' // ensure you are using css-loader
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from '@/App.vue'
import Vuelidate from 'vuelidate'
import Vue2Filters from 'vue2-filters'
import Affix from 'vue-affix'
import router from '@/router'
import store from '@/store/store'
import configHelper from '@/utils/config-helper'
import '@/registerServiceWorker'
import { withFlagProvider } from 'ld-vue'

const opts = { iconfont: 'mdi' }

Vue.use(Vuetify)
Vue.use(Vuelidate)
Vue.use(Vue2Filters)
Vue.use(Affix)
Vue.config.productionTip = false

// FOR TESTING ONLY!!!
// eslint-disable-next-line
sessionStorage.setItem('KEYCLOAK_TOKEN', 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJUbWdtZUk0MnVsdUZ0N3FQbmUtcTEzdDUwa0JDbjF3bHF6dHN0UGdUM1dFIn0.eyJqdGkiOiJhNGMzMGVkOC03YjdkLTQ5ZmEtOGMzMi1kYTU4NmZmNjM0ODIiLCJleHAiOjE1NzQ3Mjg0NjIsIm5iZiI6MCwiaWF0IjoxNTc0Njk5NjYyLCJpc3MiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJhdWQiOlsic2JjLWF1dGgtd2ViIiwiYWNjb3VudCJdLCJzdWIiOiJkOTZhM2NlNi1jMmMzLTQyZDUtOWFkZS02NTliMDZkMWU3NWEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzYmMtYXV0aC13ZWIiLCJub25jZSI6ImFlM2MxMjgzLTAxODItNGFkMS04ZWY0LTU1ZTQwN2NjYjA5NCIsImF1dGhfdGltZSI6MTU3NDY5OTY2MCwic2Vzc2lvbl9zdGF0ZSI6IjkxMzczMTFhLTUwNGMtNGY0Ni1hNmExLTc5NTU2YmUyY2E4NyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovLzE5Mi4xNjguMC4xMzo4MDgwLyIsIjE5Mi4xNjguMC4xMyIsIioiLCJodHRwOi8vMTkyLjE2OC4wLjEzOjgwODAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbInB1YmxpY191c2VyIiwiZWRpdCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCIsImZpcnN0bmFtZSI6IkJDUkVHVEVTVCBMdWNpbGxlIiwicm9sZXMiOlsicHVibGljX3VzZXIiLCJlZGl0Iiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdLCJuYW1lIjoiQkNSRUdURVNUIEx1Y2lsbGUgVFdFTlRZIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYmNzYy9wbWQzcWR6NGh6cjNocHdibTdqd3VmZWw2ZmxwcXR5aiIsImxvZ2luU291cmNlIjoiQkNTQyIsImxhc3RuYW1lIjoiVFdFTlRZIiwidXNlcm5hbWUiOiJiY3NjL3BtZDNxZHo0aHpyM2hwd2JtN2p3dWZlbDZmbHBxdHlqIn0.e8zrhQ36iGuTIcBdjNFp_LG8uzQGYrfHFcKg2id5vop-tNO7507jjkGNkJXKxVzRhpfn2nAhtkMwSCEtLZKFeEbwy31y271Svmqhn6Wbx8UMO1yYOQe6zQk9VxeOg9KWvADmOftJ4Uw8rn4Brtc-NfaxQU5Rho8TLr2irVLnuyqXvNvh5aS63VBnzxJt4ujV8LWBkfe1S36OXDne5Uw8alqVRxy4waik75--NHaFFnieORoyHE8qstd4mlC1GUr9l02TalCG9hwiaJNMxW-QKdNjUEUcYmqmiIBlHfXhdpNAWOWk4mMUGqJl3ZP9IDzjC34G5kJ0DyzP84735Q1lZA')
sessionStorage.setItem('BUSINESS_IDENTIFIER', 'CP0001547')
sessionStorage.setItem('USER_FULL_NAME', 'Severin Beauvais')

/**
 * first fetch config from server, then load Vue
 */
configHelper.fetchConfig()
  .then(() => {
    // ensure we have a Keycloak token
    if (!sessionStorage.getItem('KEYCLOAK_TOKEN')) {
      console.log('Redirecting to Auth URL...')
      const authUrl = sessionStorage.getItem('AUTH_URL')
      // assume Auth URL is always reachable
      window.location.assign(authUrl)
      return // do not execute remaining code
    }
    new Vue({
      vuetify: new Vuetify(opts),
      router,
      store,
      mixins: [withFlagProvider({ clientSideId: window['ldClientId'] })],
      render: h => h(App)
    }).$mount('#app')
  })
  .catch(error => {
    console.error('error fetching config -', error)
    alert('Fatal error loading app')
  })
