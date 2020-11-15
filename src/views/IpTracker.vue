<template>
  <v-container fluid id="ipTracker">
    <search-form :search="ipAddress" />
    <v-row justify="center" id="resultsArea">
      <v-col cols="6" md="4" id="ipResults"></v-col>
      <v-col cols="10" id="map" class="elevation-6"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import SearchForm from '../components/SearchForm.vue';

export default {
  name: 'IpTracker',
  data() {
    return {
      ipAddress: '',
    };
  },
  mounted() {
    this.loadMap();
  },
  methods: {
    loadMap() {
      const map = L.map('map').setView([51.505, -0.09], 13);
      L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.VUE_APP_ACCESS_TOKEN}`, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: process.env.VUE_APP_ACCESS_TOKEN,
      }).addTo(map);
    },
  },
  components: { SearchForm },
};
</script>

<style>
  #ipTracker {
    padding-top: 0;
  }
  /* #resultsArea {
    position: relative;
  }
  #ipResults, #map {
    position: absolute;
  } */
  #ipResults {
    z-index: 9;
  }
  #map {
    z-index: 0;
    margin-top: 3.5em;
    height: 90vh;
  }
</style>
