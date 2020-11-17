<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12">
        <h2>IP Address Look Up</h2>
      </v-col>
    </v-row>
    <search-form
      :search="userSearch"
      :loading="loading"
      @update-search="updateSearch"
      @submit="requestIpData"
    />
  </v-container>
</template>

<script>
import SearchForm from './SearchForm.vue';

export default {
  name: 'AppHeader',
  props: {
    userSearch: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    updateSearch(val) {
      this.$emit('update-search', val);
    },
    requestIpData() {
      this.$emit('submit');
    },
  },
  components: { SearchForm },
};
</script>
