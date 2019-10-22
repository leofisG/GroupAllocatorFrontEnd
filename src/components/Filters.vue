<template>
  <v-list dense>
    <v-list-item class="pa-2" v-for="filter in openFilters" :key="filter" v-bind:filter="filter">
      <component
        v-if="openFilters.includes(filter)"
        :is="filter"
        @remove="removeFilter"
        @update="updateFilter"
      />
    </v-list-item>
  </v-list>
</template>

<script>
import SizeFilter from "../filters/SizeFilter";
import TimeZoneFilter from "../filters/TimeZoneFilter";

export default {
  name: "filters",
  props: {
    studentAmount: Number,
    student: Object
  },
  data: function() {
    return {
      openFilters: ["SizeFilter"],
      availableFilters: ["TimeZoneFilter"],
      filters: {}
    };
  },
  watch: {
    filters: function(_, newFilter) {
      this.$emit("update", newFilter);
    }
  },
  methods: {
    updateFilters() {},
    updateFilter(values) {
      this.filters = {
        ...this.filters,
        ...values
      };
      console.log(this.filters);
    },
    removeFilter(data) {
      this.openFilters = this.openFilters.filter(e => e != data.name);
      this.availableFilters.push(data.name);
      this.removeFromFilters(data.values);
    },
    removeFromFilters(values) {
      for (const value of values) {
        delete this.filters[value];
      }
      console.log(this.filters);
    }
  },
  components: {
    SizeFilter,
    TimeZoneFilter
  }
};
</script>

<style>
</style>