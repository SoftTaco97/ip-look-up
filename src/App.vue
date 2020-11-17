<template>
  <v-app>
    <header>
      <AppHeader
        :userSearch="userSearch"
        :loading="loading"
        @update-search="updateSearch"
        @submit="processIp"
      />
    </header>
    <v-main>
      <v-container fluid>
        <v-row justify="center" id="resultsArea">
          <v-col cols="8" md="6" id="ipResults">
            <v-sheet rounded elevation="2">
              <v-container fluid>
                <v-row justify="center" no-gutters>
                  <v-col
                    v-for="({ title, value }, index) in ipData"
                    :key="index"
                    cols="12"
                    md="6"
                    lg="3"
                    class="text-center text-md-left"
                  >
                    <small>{{ title }}</small>
                    <h3>{{ value }}</h3>
                  </v-col>
                  <v-col v-if="ipData.length <= 0">
                    Loading...
                  </v-col>
                </v-row>
              </v-container>
            </v-sheet>
          </v-col>
          <v-col cols="12" id="map"></v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer
      app
      padless
      color="indigo accent-3"
    >
      <AppFooter />
    </v-footer>
    <v-snackbar
      v-model="error"
      top
      right
      color="error"
    >
      <v-icon class="mr-2">mdi-cloud-alert</v-icon>
      Whoops! Can't seem to request that IP
    </v-snackbar>
  </v-app>
</template>

<script>
import axios from 'axios';
import createMap from './util/map';
import capitalize from './util/capitalize';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';

export default {
  name: 'App',
  data() {
    return {
      userSearch: '',
      ipData: [],
      updateMap: null,
      error: false,
      loading: false,
    };
  },
  mounted() {
    // Load the data
    this.processIp();
  },
  methods: {
    mapTitle(value) {
      const titles = {
        isp: 'Internet Service Provider',
        ip: 'IP Address',
      };
      return titles[value] || capitalize(value);
    },
    updateSearch(search) {
      this.userSearch = search;
    },
    createIpData({ location, ip, isp }) {
      // Create a readable location
      const locationVal = `${location.city}, ${location.region} ${location.postalCode}`;
      // Create an object of data we need to showcase
      const dataObj = {
        ip,
        location: locationVal,
        timezone: location.timezone,
        isp,
      };
      // Loop over the data needed to showcase and return it
      return Object.entries(dataObj).map(([key, value]) => ({
        title: this.mapTitle(key),
        value,
      }));
    },
    setMap({ lat, lng } = {}) {
      // Set the location of the map based on if the updateMap property is set
      if (!this.updateMap) {
        this.updateMap = createMap(lat, lng);
      } else {
        this.updateMap(lat, lng);
      }
    },
    async processIp() {
      this.loading = true;
      try {
        const { location, isp, ip } = await this.requestIpData() || {};
        if (location && isp && ip) {
          this.ipData = this.createIpData({ location, isp, ip });
          // Set the ip address variable if it is not set
          if (!this.userSearch) this.updateSearch(ip);

          // Update the map
          this.setMap(location);
        }
      } catch (e) {
        this.error = true;
      } finally {
        this.loading = false;
      }
    },
    async requestIpData() {
      const url = `https://geo.ipify.org/api/v1?apiKey=${process.env.VUE_APP_API_KEY}&domain=${this.userSearch}`;
      const { status, data } = await axios.get(url);
      if (status === 200 && data) return data;
      throw new Error('Bad information returned');
    },
  },
  components: { AppHeader, AppFooter },
};
</script>

<style>
  header {
    background-image: url('assets/pattern-bg.png');
    background-size: cover;
    background-position: center center;
  }

  header h2, footer h3 {
    color: #ffffff;
    font-family: 'Roboto', sans-serif;
    font-weight: normal;
  }

  header h2 {
    text-align: center;
  }

  #ipTracker {
    padding-top: 0;
  }
  #resultsArea {
    position: relative;
  }
  #ipResults, #map {
    position: absolute;
  }
  #ipResults {
    z-index: 9;
    margin-top: -3.5em;
  }
  #map {
    z-index: 0;
    margin-top: -1em;
    height: calc(100vh - 22.5em);
    border-radius: 5px;
  }

  /* Desktop styling */
  @media screen and (min-width: 1025px) {
    .v-sheet > .container > .row > .col-md-6 {
      padding: 0 .5em;
    }
    .v-sheet > .container > .row > .col-md-6:not(:last-of-type) {
      border-right: 1px solid lightgray;
    }
  }
</style>
