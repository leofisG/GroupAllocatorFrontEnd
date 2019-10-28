<template>
  <v-list dense>
    <v-list-item
      class="pa-2"
      v-for="filter in openFilters"
      :key="filter.type"
      v-bind:filter="filter"
    >
      <component
        v-if="openFilters.includes(filter)"
        :is="filter.type"
        v-bind:filters="filters"
        @remove="removeFilter"
        @update="updateFilter"
        @removeValues="removeFromFilters"
        @warn="warnUser"
        @unwarn="unwarnUser"
      />
    </v-list-item>
    <v-menu v-if="availableFilters.length > 0" offset-y close-on-content-click>
      <template v-slot:activator="{ on:menu }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn fab dark x-small v-on="{ ...tooltip, ...menu }">
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Select a filter to add</span>
        </v-tooltip>
      </template>
      <v-list>
        <v-list-item v-for="(filter, index) in availableFilters" @click="addFilter(filter)" :key="index" v-bind:filter="filter">
          <v-list-item-title>{{ filter.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-list>
</template>

<script>
import SizeFilter from "../filters/SizeFilter";
import TimeZoneFilter from "../filters/TimeZoneFilter";
import AgeFilter from "../filters/AgeFilter";
import GenderFilter from "../filters/GenderFilter";

export default {
  name: "filters",
  props: {
    studentAmount: Number,
    student: Object
  },
  data: function() {
    return {
      openFilters: [
        {
          type: "SizeFilter",
          name: "Size"
        }
      ],
      availableFilters: [
        {
          type: "TimeZoneFilter",
          name: "Timezone"
        },
        {
          type: "AgeFilter",
          name: "Age"
        },
        {
          type: "GenderFilter",
          name: "Gender"
        }
      ],
      filters: {},
      info: {}
    };
  },
  methods: {
    updateFilters() {
      this.$emit('update', this.filters);
    },
    addFilter(filter) {
      this.availableFilters = this.availableFilters.filter(e => e != filter);
      this.openFilters.push(filter);
    },
    updateFilter(values) {
      this.filters = Object.assign(this.filters, values)
      this.updateFilters();
    },
    removeFilter(data) {
      const filter = this.openFilters.find(e => e.type == data.type);
      this.openFilters = this.openFilters.filter(e => e.type != data.type);
      this.availableFilters.push(filter);
      this.removeFromFilters(data.values);
    },
    removeFromFilters(values) {
      for (const value of values) {
        delete this.filters[value];
      }
      this.updateFilters();
    },
    warnUser(filterName) {
      this.$emit('warn', filterName)
    },
    unwarnUser(filterName) {
      this.$emit('unwarn', filterName)
    }
  },
  components: {
    SizeFilter,
    TimeZoneFilter,
    AgeFilter,
    GenderFilter
  }
};
</script>

<style>
</style>