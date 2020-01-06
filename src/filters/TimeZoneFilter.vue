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
  props: {
    id: Number
  },
  computed: {
    filter() {
      return this.$store.getters.getFilter(this.id);
    }
  },
  data() {
    return {
      currentType: "Same",
      timeZoneTypes: ["Same", "Different"],
      timezoneDiff: 1
    };
  },
  watch: {
    currentType() {
      this.updateFilters();
    },
    timezoneDiff() {
      this.updateFilters();
    }
  },
  mounted() {
    const filter = this.filter;
    if ("timezoneDiff" in filter.values) {
      if (filter.values.timezoneDiff === 0) {
        this.currentType = "Same";
      } else {
        this.currentType = "Different";
        this.timezoneDiff = filter.values.timezoneDiff;
      }
    }
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
      this.$store.commit("removeFilter", this.id);
    },
    updateFilters() {
      const values =
        this.currentType == "Same"
          ? {
              timezoneDiff: 0
            }
          : {
              timezoneDiff: Number(this.timezoneDiff)
            };
      this.$store.commit("updateFilter", { id: this.id, values });
    }
  }
};
</script>

<style>
</style>