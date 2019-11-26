<template>
  <v-app class="app-container theme--light" id="app">

    <!-- Initial Page Load Transition -->
    <transition name="fade">
      <div class="loading-container" v-show="showLoadingContainer">
        <div class="loading__content">
          <v-progress-circular color="primary" size="50" indeterminate />
          <div class="loading-msg">Loading Business Dashboard</div>
        </div>
      </div>
    </transition>

    <DashboardUnavailableDialog
      :dialog="dashboardUnavailableDialog"
      @exit="onClickExit"
      @retry="onClickRetry"
    />

    <AccountAuthorizationDialog
      :dialog="accountAuthorizationDialog"
      @exit="onClickExit"
      @retry="onClickRetry"
    />

    <sbc-header ref="sbcHeader" :brandLink="origin" :authURL="authAPIURL" />

    <div class="app-body">
      <main v-if="dataLoaded">
        <EntityInfo />
        <router-view />
      </main>
    </div>

    <sbc-footer />

  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { DateMixin, AddressMixin, CommonMixin } from '@/mixins'
import axios from '@/axios-auth'
import DashboardUnavailableDialog from '@/components/Dashboard/DashboardUnavailableDialog.vue'
import AccountAuthorizationDialog from '@/components/Dashboard/AccountAuthorizationDialog.vue'
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import EntityInfo from '@/components/EntityInfo.vue'
import { EntityTypes } from '@/enums'

export default {
  name: 'App',

  mixins: [DateMixin, AddressMixin, CommonMixin],

  data () {
    return {
      dataLoaded: false,
      dashboardUnavailableDialog: false,
      accountAuthorizationDialog: false,
      EntityTypes
    }
  },

  components: {
    DashboardUnavailableDialog,
    AccountAuthorizationDialog,
    SbcHeader,
    SbcFooter,
    EntityInfo
  },

  computed: {
    ...mapState(['triggerDashboardReload']),

    origin () {
      const root = window.location.origin || ''
      const path = process.env.VUE_APP_PATH
      return `${root}/${path}`
    },

    authAPIURL () {
      return sessionStorage.getItem('AUTH_API_URL')
    },

    showLoadingContainer () {
      return !this.dataLoaded && !this.dashboardUnavailableDialog && !this.accountAuthorizationDialog
    }
  },

  created () {
    // fetch all data
    this.fetchData()
  },

  methods: {
    ...mapActions(['setKeycloakRoles', 'setAuthRoles', 'setBusinessEmail', 'setBusinessPhone',
      'setBusinessPhoneExtension', 'setCurrentDate', 'setEntityName', 'setEntityType', 'setEntityStatus',
      'setEntityBusinessNo', 'setEntityIncNo', 'setLastPreLoadFilingDate', 'setEntityFoundingDate', 'setLastAgmDate',
      'setNextARDate', 'setTasks', 'setFilings', 'setMailingAddress', 'setDeliveryAddress', 'setDirectors',
      'setTriggerDashboardReload']),

    fetchData () {
      this.dataLoaded = false
      let businessId

      try {
        // get initial data
        const jwt = this.getJWT()
        const keycloakRoles = this.getKeycloakRoles(jwt)
        this.setKeycloakRoles(keycloakRoles)
        businessId = this.getBusinessId()
        this.updateCurrentDate()
      } catch (error) {
        console.error(error) // eslint-disable-line no-console
        this.dashboardUnavailableDialog = true
        return // do not execute remaining code
      }

      // check if current user is authorized
      this.getAuthorizations(businessId).then(data => {
        this.storeAuthRoles(data) // throws if no role

        // good so far ... fetch the rest of the data
        Promise.all([
          this.getBusinessInfo(businessId),
          axios.get(businessId),
          axios.get(businessId + '/tasks'),
          axios.get(businessId + '/filings'),
          axios.get(businessId + '/addresses'),
          axios.get(businessId + '/directors')
        ]).then(data => {
          if (!data || data.length !== 6) throw new Error('Incomplete data')
          this.storeBusinessInfo(data[0])
          this.storeEntityInfo(data[1])
          this.storeTasks(data[2])
          this.storeFilings(data[3])
          this.storeAddresses(data[4])
          this.storeDirectors(data[5])
          this.dataLoaded = true
        }).catch(error => {
          console.error(error) // eslint-disable-line no-console
          this.dashboardUnavailableDialog = true
        })
      }).catch(error => {
        console.error(error) // eslint-disable-line no-console
        this.accountAuthorizationDialog = true
      })
    },

    getJWT () {
      const token = sessionStorage.getItem('KEYCLOAK_TOKEN')
      if (token) {
        return this.parseJwt(token)
      }
      throw new Error('Error getting Keycloak token')
    },

    parseJwt (token) {
      try {
        const base64Url = token.split('.')[1]
        const base64 = decodeURIComponent(window.atob(base64Url).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
        return JSON.parse(base64)
      } catch (error) {
        throw new Error('Error parsing JWT - ' + error)
      }
    },

    getKeycloakRoles (jwt) {
      const keycloakRoles = jwt.roles
      if (keycloakRoles && keycloakRoles.length > 0) {
        return keycloakRoles
      }
      throw new Error('Error getting Keycloak roles')
    },

    getBusinessId () {
      const businessId = sessionStorage.getItem('BUSINESS_IDENTIFIER')
      if (businessId) {
        return businessId
      }
      throw new Error('Error getting business identifier')
    },

    updateCurrentDate () {
      const now = new Date()
      const date = this.dateToUsableString(now)
      this.setCurrentDate(date)
      // set timeout to run this again at midnight
      const hoursToMidnight = 23 - now.getHours()
      const minutesToMidnight = 59 - now.getMinutes()
      const secondsToMidnight = 59 - now.getSeconds()
      const timeout = ((((hoursToMidnight * 60) + minutesToMidnight) * 60) + secondsToMidnight) * 1000
      setTimeout(this.updateCurrentDate, timeout)
    },

    getAuthorizations (businessId) {
      const url = businessId + '/authorizations'
      const config = {
        baseURL: this.authAPIURL + 'entities/'
      }
      return axios.get(url, config)
    },

    getBusinessInfo (businessId) {
      const url = businessId
      const config = {
        baseURL: this.authAPIURL + 'entities/'
      }
      return axios.get(url, config)
    },

    storeAuthRoles (response) {
      // NB: roles array may contain 'view', 'edit' or nothing
      const authRoles = response && response.data && response.data.roles
      if (authRoles && authRoles.length > 0) {
        this.setAuthRoles(authRoles)
      } else {
        throw new Error('Invalid auth roles')
      }
    },

    storeBusinessInfo (response) {
      const contacts = response && response.data && response.data.contacts
      // ensure we received the right looking object
      // but allow empty contacts array
      if (contacts) {
        // at this time there is at most 1 contact
        const contact = contacts.length > 0 && contacts[0]
        if (contact) {
          this.setBusinessEmail(contact.email)
          this.setBusinessPhone(contact.phone)
          this.setBusinessPhoneExtension(contact.phoneExtension)
        }
      } else {
        throw new Error('Invalid business contact info')
      }
    },

    storeEntityInfo (response) {
      if (response && response.data && response.data.business) {
        this.setEntityName(response.data.business.legalName)
        this.setEntityType(response.data.business.legalType)
        this.setNextARDate(response.data.business.nextAnnualReport)
        this.setEntityStatus(response.data.business.status)
        this.setEntityBusinessNo(response.data.business.taxId)
        this.setEntityIncNo(response.data.business.identifier)
        this.setLastPreLoadFilingDate(response.data.business.lastLedgerTimestamp
          ? response.data.business.lastLedgerTimestamp.split('T')[0] : null)
        this.setEntityFoundingDate(response.data.business.foundingDate) // datetime
        const date = response.data.business.lastAnnualGeneralMeetingDate
        if (
          date &&
          date.length === 10 &&
          date.indexOf('-') === 4 &&
          date.indexOf('-', 5) === 7 &&
          date.indexOf('-', 8) === -1
        ) {
          this.setLastAgmDate(date)
        } else {
          this.setLastAgmDate(null)
        }
      } else {
        throw new Error('Invalid entity info')
      }
    },

    storeTasks (response) {
      if (response && response.data && response.data.tasks) {
        this.setTasks(response.data.tasks)
<<<<<<< Updated upstream
=======
        // FOR TESTING ONLY
        const tasks = [
          // eslint-disable-next-line
          {"enabled":true,"order":1,"task":{"todo":{"business":{"fiscalYearEndDate":"2019-10-03","foundingDate":"1985-01-22T00:00:00+00:00","identifier":"CP0001468","lastAnnualGeneralMeetingDate":"2018-09-12","lastAnnualReport":"2018-09-12","lastLedgerTimestamp":"2018-11-13T00:00:00+00:00","lastModified":"2019-10-03T20:57:01.030439+00:00","legalName":"MANANA PARK WATER CO-OPERATIVE","legalType":"CP","nextAnnualReport":"2019-09-12T00:00:00+00:00"},"header":{"ARFilingYear":2019,"name":"annualReport","status":"DRAFT"}}}},
          // eslint-disable-next-line
          {"enabled":false,"order":2,"task":{"filing":{"business":{"foundingDate":"1985-01-22","identifier":"CP0001468","legalName":"MANANA PARK WATER CO-OPERATIVE"},"changeOfDirectors":{"directors":[{"actions":["ceased"],"appointmentDate":"2019-10-18","cessationDate":"2019-10-22","deliveryAddress":{"addressCity":"Burbank","addressCountry":"US","addressRegion":"--","deliveryInstructions":"","postalCode":"91505-4175","streetAddress":"3400 Warner Blvd","streetAddressAdditional":"Trailer D"},"id":1,"isDirectorActionable":true,"isFeeApplied":true,"mailingAddress":{"addressCity":"Burbank","addressCountry":"US","addressRegion":"--","deliveryInstructions":"","postalCode":"91505-4175","streetAddress":"3400 Warner Blvd","streetAddressAdditional":"Trailer D"},"officer":{"firstName":"DAFFY","lastName":"DUCK","middleInitial":"H.","prevFirstName":"DAFFY","prevLastName":"DUCK","prevMiddleInitial":"H."}},{"actions":["ceased"],"appointmentDate":"2019-10-21","cessationDate":"2019-10-22","deliveryAddress":{"addressCity":"Dartmouth","addressCountry":"CA","addressRegion":"NS","deliveryInstructions":"","postalCode":"B3B 1S4","streetAddress":"S-121 Ilsley Ave","streetAddressAdditional":"asdf"},"id":2,"isDirectorActionable":true,"isFeeApplied":true,"mailingAddress":{"addressCity":"Dartmouth","addressCountry":"CA","addressRegion":"NS","deliveryInstructions":"","postalCode":"B3B 1S4","streetAddress":"S-121 Ilsley Ave","streetAddressAdditional":"asdf"},"officer":{"firstName":"BUGS","lastName":"BUNNY","middleInitial":"D.","prevFirstName":"BUGS","prevLastName":"BUNNY","prevMiddleInitial":"D."}}]},"header":{"certifiedBy":"Severin ","colinId":null,"date":"2019-10-22","email":"no_one@never.get","filingId":1135,"name":"changeOfDirectors","status":"DRAFT","submitter":"cp0001468"}}}},
          // eslint-disable-next-line
          {"enabled":false,"order":3,"task":{"filing":{"business":{"foundingDate":"1985-01-22","identifier":"CP0001468","legalName":"MANANA PARK WATER CO-OPERATIVE"},"changeOfAddress":{"deliveryAddress":{"actions":["addressChanged"],"addressCity":"Ladysmith","addressCountry":"CA","addressRegion":"BC","addressType":"","deliveryInstructions":"","postalCode":"V9G 1L7","streetAddress":"4750 Brenton-Page Rd","streetAddressAdditional":""},"mailingAddress":{"actions":["addressChanged"],"addressCity":"Ladysmith","addressCountry":"CA","addressRegion":"BC","addressType":"","deliveryInstructions":"","postalCode":"V9G 1L7","streetAddress":"4750 Brenton-Page Rd","streetAddressAdditional":""}},"header":{"certifiedBy":"Severin ","colinId":null,"date":"2019-10-22","email":"no_one@never.get","filingId":1133,"name":"changeOfAddress","paymentToken":"701","status":"PENDING","submitter":"cp0001468"}}}}
        ]
        this.setTasks(tasks)
>>>>>>> Stashed changes
      } else {
        throw new Error('Invalid tasks')
      }
    },

    storeFilings (response) {
      if (response && response.data && response.data.filings) {
        // sort by date descending (ie, latest to earliest)
        const filings = response.data.filings.sort(
          (a, b) => (b.filing.header.date - a.filing.header.date)
        )
        this.setFilings(filings)
      } else {
        throw new Error('Invalid filings')
      }
    },

    storeAddresses (response) {
      if (response && response.data && response.data.mailingAddress) {
        this.setMailingAddress(this.omitProp(response.data.mailingAddress, ['addressType']))
      } else {
        throw new Error('Invalid mailing address')
      }
      if (response && response.data && response.data.deliveryAddress) {
        this.setDeliveryAddress(this.omitProp(response.data.deliveryAddress, ['addressType']))
      } else {
        throw new Error('Invalid delivery address')
      }
    },

    storeDirectors (response) {
      if (response && response.data && response.data.directors) {
        const directors = response.data.directors
        for (var i = 0; i < directors.length; i++) {
          directors[i].id = i + 1
          directors[i].isNew = false
          directors[i].isDirectorActive = true
        }
        this.setDirectors(directors)
      } else {
        throw new Error('Invalid directors')
      }
    },

    onClickExit () {
      this.$refs.sbcHeader.logout()
    },

    onClickRetry () {
      this.dashboardUnavailableDialog = false
      this.accountAuthorizationDialog = false
      this.fetchData()
    }
  },

  watch: {
    '$route' () {
      // if we (re)route to the dashboard then re-fetch all data
      // (does not fire on initial dashboard load)
      if (this.$route.name === 'dashboard') {
        this.fetchData()
      }
    },

    triggerDashboardReload (val) {
      if (val) {
        this.fetchData()
        this.setTriggerDashboardReload(false)
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/styles/base.scss";
@import "@/assets/styles/layout.scss";
@import "@/assets/styles/overrides.scss";
</style>
