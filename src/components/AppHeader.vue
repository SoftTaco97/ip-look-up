<template>
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
</template>

<script>
import SearchForm from './SearchForm.vue';

export default {
  name: 'AppHeader',
  props: {
    ipAddress: {
      type: String,
      required: true,
    },
  },
  methods: {
    updateIpAddress(val) {
      this.$emit('update-search', val);
    },
    requestIpData() {
      this.$emit('submit');
    },
  },
  components: { SearchForm },
};
</script>
