<template>
  <v-card width="100%">
    <v-card-title class="justify-center">
      Timezones
      <v-btn @click="this.remove" absolute right fab dark x-small>
        <v-icon dark>mdi-minus</v-icon>
      </v-btn>
    </v-card-title>
    <v-list-item>
      <v-select v-model="currentType" :items="timeZoneTypes" label="Filter type"></v-select>
    </v-list-item>
    <v-list-item v-if="currentType == &quot;Different&quot;">
      <v-text-field
        type="number"
        min="0"
        label="Timezone difference"
        clearable
        v-model="timezoneDiff"
        @change="validateTimezone"
      ></v-text-field>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: "timezonefilter",
  data: function() {
    return {
      currentType: "Same",
      timeZoneTypes: ['Same', 'Different'],
      timezoneDiff: 1
    };
  },
  watch: {
    currentType: function() {
      this.updateFilters()
    },
    timezoneDiff: function() {
      this.updateFilters()
    }
  },
  mounted: function() {
    this.updateFilters();
  },
  methods: {
    validateTimezone() {
      if (this.timezoneDiff < 1) {
        this.timezoneDiff = 1;
      }
      if (this.timezoneDiff > 24) {
        this.timezoneDiff = 24;
      }
    },
    remove() {
      this.$store.commit("removeFromFilter", ["timezoneDiff"])
      this.$store.commit("removeFilter", "TimeZoneFilter");
    },
    updateFilters() {
      const values =
        this.currentType == "Same"
          ? {
              timezoneDiff: 0
            }
          : {
              timezoneDiff: this.timezoneDiff
            };
      this.$store.commit("updateFilters", values);
    }
  }
};
</script>

<style>
</style>