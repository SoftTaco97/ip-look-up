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
          <v-col cols="12" md="2">
            <v-btn
              type="submit"
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
