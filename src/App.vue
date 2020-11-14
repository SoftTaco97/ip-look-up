<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <app-header />
    </v-app-bar>
    <v-main>
      <ip-tracker />
    </v-main>
  </v-app>
</template>

<script>
import AppHeader from './components/Header.vue';
import IpTracker from './views/IpTracker.vue';

export default {
  name: 'App',
  components: { AppHeader, IpTracker },
  data() {},
};
</script>
