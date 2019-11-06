<template>
  <v-card width="100%">
    <v-card-title class="justify-center">
      Ages
      <v-btn @click="this.remove" absolute right fab dark x-small>
        <v-icon dark>mdi-minus</v-icon>
      </v-btn>
    </v-card-title>
    <v-list-item>
      <v-select v-model="currentType" :items="ageTypes" label="Filter type"></v-select>
    </v-list-item>
    <v-list-item v-if="currentType == &quot;Different&quot;">
      <v-text-field
        type="number"
        min="1"
        label="Age difference"
        clearable
        v-model="ageDiff"
        @change="validateAge"
      ></v-text-field>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "agefilter",
  computed: {
    ...mapState(["filters"])
  },
  data: function() {
    return {
      currentType: "Same",
      ageTypes: ["Same", "Different"],
      ageDiff: 0
    };
  },
  watch: {
    currentType: function() {
      this.validateAge();
      this.updateFilters();
    },
    ageDiff: function() {
      this.updateFilters();
    }
  },
  mounted: function() {
    if ("ageDiff" in this.filters && this.filters.ageDiff > 0) {
      this.currentType = "Different";
      this.ageDiff = this.filters.ageDiff;
    } else {
      this.updateFilters();
    }
  },
  methods: {
    validateAge() {
      if (this.currentType == "Different") {
        if (this.ageDiff < 1) {
          this.ageDiff = 1;
        }
        if (this.ageDiff > 70) {
          this.ageDiff = 70;
        }
      }
    },
    remove() {
      this.$store.commit("removeFromFilter", ["ageDiff"]);
      this.$store.commit("removeFilter", "AgeFilter");
    },
    updateFilters() {
      const values =
        this.currentType == "Same"
          ? {
              ageDiff: 0
            }
          : {
              ageDiff: this.ageDiff
            };
      this.$store.commit("updateFilters", values);
    }
  }
};
</script>

<style>
</style>