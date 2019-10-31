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
      timeZoneType: "Same",
      timezoneDiff: 1
    };
  },
  watch: {
    timeZoneType: function() {
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
      this.$emit("remove", {
        type: "TimeZoneFilter",
        values: ["timezoneDiff"]
      });
    },
    updateFilters() {
      const values =
        this.timeZoneType == "Same"
          ? {
              timezoneDiff: 0
            }
          : {
              timezoneDiff: this.timezoneDiff
            };
      this.$emit("update", values);
    }
  }
};
</script>

<style>
</style>