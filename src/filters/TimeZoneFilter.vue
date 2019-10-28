<template>
  <v-card width="100%">
    <v-card-title class="justify-center">
      Timezones
      <v-btn @click="this.remove" absolute right fab dark x-small>
        <v-icon dark>mdi-minus</v-icon>
      </v-btn>
    </v-card-title>
    <v-list-item>
      <v-select v-model="timeZoneType" :items="['Same', 'Different']" label="Filter type"></v-select>
    </v-list-item>
    <v-list-item v-if="timeZoneType == &quot;Different&quot;">
      <v-text-field
        type="number"
        min="0"
        label="Timezone difference"
        clearable
        v-model="timeZoneDiff"
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
      timeZoneType: "Same",
      timeZoneDiff: 1
    };
  },
  watch: {
    timeZoneType: function() {
      this.updateFilters()
    },
    timeZoneDiff: function() {
      this.updateFilters()
    }
  },
  mounted: function() {
    this.updateFilters();
  },
  methods: {
    validateTimezone() {
      if (this.timeZoneDiff < 1) {
        this.timeZoneDiff = 1;
      }
      if (this.timeZoneDiff > 24) {
        this.timeZoneDiff = 24;
      }
    },
    remove() {
      this.$emit("remove", {
        type: "TimeZoneFilter",
        values: ["timeZoneDiff"]
      });
    },
    updateFilters() {
      const values =
        this.timeZoneType == "Same"
          ? {
              timeZoneDiff: 0
            }
          : {
              timeZoneDiff: this.timeZoneDiff
            };
      this.$emit("update", values);
    }
  }
};
</script>

<style>
</style>