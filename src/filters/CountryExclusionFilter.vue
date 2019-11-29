<template>
  <v-card width="100%">
    <v-card-title class="justify-center">Country Exclusion
      <v-btn @click="this.remove" absolute right fab dark x-small>
        <v-icon dark>mdi-minus</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      Specify the maximum number of students that can be from the same country 
      here.
    </v-card-text>
    <v-list-item>
      <v-text-field
        type="number"
        min="1"
        label="Max Same Country"
        clearable
        v-model="maxSameCountry"
        @change="validateMaxSameCountry"
      ></v-text-field>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "countryfilter",
  computed: {
    ...mapState(["filters"]),
    ...mapGetters(["studentCount"])
  },
  watch: {
    maxSameCountry: function() {
      this.updateFilters();
    },
  },
  data: function() {
    return {
      maxSameCountry: 1,
    };
  },
  mounted: function() {
    if ("country" in this.filters) {
      this.maxSameCountry = parseInt(this.filters.country.split(",")[0])
    }
    this.updateFilters();
  },
  methods: {
    validateMaxSameCountry() {
      if (this.maxSameCountry <= 1) {
        this.maxSameCountry = 1;
      }
      if (this.maxSameCountry >= this.studentCount) {
        this.maxSameCountry = this.studentCount - 1;
      }
    },
    remove() {
      this.$store.commit("removeFromFilter", ["country"])
      this.$store.commit("removeFilter", "CountryExclusionFilter");
    },
    updateFilters() {
      const values =
            {
              country: `0, ${this.maxSameCountry}`,
            };
      this.$store.commit("updateFilters", values);
    }
  }
};
</script>

<style>
</style>