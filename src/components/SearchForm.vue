<template>
  <v-row
    justify="center"
    id="searchForm"
  >
    <v-col cols="12">
      <h2>IP Address Tracker</h2>
    </v-col>
    <v-col
      cols="12"
      md="6"
      lg="4"
    >
      <v-form
        ref="form"
        v-model="valid"
        @submit.prevent="submission"
      >
        <v-row>
          <v-col
            cols="12"
            md="10"
          >
            <v-text-field
              v-model="ipAddress"
              :rules="searchRules"
              label="IP Address"
              placeholder="Enter IP Here.."
              hint="Example: 123.456.78.9"
              outlined
              clearable
              dark
            />
          </v-col>
          <v-col cols="12" md="2" class="mt-2">
            <v-btn
              :block="isMobile"
              large
              color="indigo accent-3"
              aria-label="search"
              class="white--text"
              :disabled="!valid"
            >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
const ipRegex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;

export default {
  name: 'SearchForm',
  props: {
    search: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      valid: false,
      searchRules: [
        (v) => !!v || 'Required',
        (v) => ipRegex.test(v) || 'Search must be a valid IPV4 IP Address.',
      ],
    };
  },
  computed: {
    ipAddress: {
      get() {
        return this.search;
      },
      set(val) {
        this.$emit('update-search', val);
      },
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile;
    },
  },
  methods: {
    submission() {
      console.log('Submitted!');
    },
  },
};
</script>

<style scoped>
  h2 {
    color: #ffffff;
    text-align: center;
  }
  #searchForm {
    background-image: url('../assets/pattern-bg.png');
    background-size: cover;
    background-position: center center;
  }
</style>

<style>
  .v-message > .v-messages__wrapper > .v-messages__message
    :not(.error--text > .v-messages__wrapper > .v-messages__message) {
    color: #ffffff;
  }
</style>
