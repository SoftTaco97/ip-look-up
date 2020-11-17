<template>
  <v-row justify="center">
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
              v-model="userSearch"
              :rules="searchRules"
              label="IP Address"
              placeholder="Enter IP or Domain Here.."
              hint="123.456.78.9 or www.example.com"
              outlined
              clearable
              dark
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              type="submit"
              :block="isMobile"
              large
              color="indigo accent-3"
              aria-label="search"
              class="white--text"
              :disabled="!valid"
              :loading="loading"
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
const ipRegex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
const domainRegex = /^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})$/;

export default {
  name: 'SearchForm',
  props: {
    search: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      valid: false,
      searchRules: [
        (v) => !!v || 'Required',
        (v) => ipRegex.test(v) || domainRegex.test(v) || 'Search must be a valid IPV4 IP Address or domain.',
      ],
    };
  },
  computed: {
    userSearch: {
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
      this.$emit('submit');
    },
  },
};
</script>
<style>
  .v-message > .v-messages__wrapper > .v-messages__message
    :not(.error--text > .v-messages__wrapper > .v-messages__message) {
    color: #ffffff;
  }
  @media only screen and (min-width: 1024px) {
    form button[type="submit"] {
      margin-top: .46em;
    }
  }
</style>
