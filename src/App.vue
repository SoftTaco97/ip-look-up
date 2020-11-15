<template>
  <v-app>
    <header>
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12">
            <h2>IP Address Look Up</h2>
          </v-col>
        </v-row>
        <search-form
          :search="ipAddress"
          @update-search="updateIpAddress"
          @submit="requestIpData"
        />
      </v-container>
    </header>
    <v-main>
      <v-container fluid>
        <v-row justify="center" id="resultsArea">
          <v-col cols="8" md="6" id="ipResults">
            <v-sheet rounded>
              <v-container fluid>
                <v-row justify="center" no-gutters>
                  <v-col
                    v-for="({ title, value }, index) in ipData"
                    :key="index"
                    cols="12"
                    md="3"
                  >
                    <small>{{ title }}</small>
                    <h3>{{ value }}</h3>
                  </v-col>
                  <v-col v-if="ipData.length === 0">
                    Loading...
                  </v-col>
                </v-row>
              </v-container>
            </v-sheet>
          </v-col>
          <v-col cols="12" id="map" class="elevation-6"></v-col>
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
  </v-app>
</template>

<script>
import axios from 'axios';
import createMap from './util/map';
import capitalize from './util/capitalize';
import AppFooter from './components/AppFooter.vue';
import SearchForm from './components/SearchForm.vue';

export default {
  name: 'App',
  data() {
    return {
      ipAddress: '',
      ipData: [],
      updateMap: null,
    };
  },
  mounted() {
    // Load the data
    this.requestIpData();
  },
  methods: {
    mapTitle(value) {
      const titles = {
        isp: 'Internet Service Provider',
        ip: 'IP Address',
      };
      return titles[value] || capitalize(value);
    },
    updateIpAddress(ip) {
      this.ipAddress = ip;
    },
    populateData({ location, ip, isp }) {
      // Create a readable location
      const locationVal = `${location.city}, ${location.region} ${location.postalCode}`;

      // Create an object of data we need to showcase
      const dataObj = {
        ip,
        location: locationVal,
        timezone: location.timezone,
        isp,
      };

      // Loop over the data needed to showcase and assign it
      this.ipData = Object.entries(dataObj).map(([key, value]) => ({
        title: this.mapTitle(key),
        value,
      }));

      // Set the ip address variable if it is not set
      if (!this.ipAddress) this.updateIpAddress(ip);

      // Load the location on the map
      if (!this.updateMap) {
        this.updateMap = createMap(location.lat, location.lng);
      } else {
        this.updateMap(location.lat, location.lng);
      }
    },
    async requestIpData() {
      const url = `https://geo.ipify.org/api/v1?apiKey=${process.env.VUE_APP_API_KEY}&ipAddress=${this.ipAddress}`;
      const { data } = await axios.get(url);
      this.populateData(data);
    },
  },
  components: { SearchForm, AppFooter },
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
</style>
