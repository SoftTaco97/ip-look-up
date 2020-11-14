<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <app-header />
    </v-app-bar>
    <v-main>
      <HelloWorld/>
    </v-main>
  </v-app>
</template>

<script>
import AppHeader from './components/Header.vue';

export default {
  name: 'App',
  components: { AppHeader },
  data() {},
};
</script>
