<template>
  <v-app>
    <v-main>
      <ip-tracker />
    </v-main>
  </v-app>
</template>

<script>
import IpTracker from './views/IpTracker.vue';

export default {
  name: 'App',
  components: { IpTracker },
};
</script>
