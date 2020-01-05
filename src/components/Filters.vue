<template>
  <v-list dense>
    <v-list-item
      class="pa-2"
      v-for="filter in openFilters"
      :key="filter.id"
      v-bind:filter="filter"
    >
    <component
      :is="filter.type"
      :id="filter.id"
    />
    </v-list-item>
    <v-menu v-if="availableFilters.length > 0" offset-x close-on-content-click open-on-hover>
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
          <v-tooltip right>
            <template v-slot:activator="{ on: tooltip }">
              <v-list-item-title v-on="{ ...tooltip }">{{ filter.name }}</v-list-item-title>
            </template>
            {{ filter.tooltip }}
          </v-tooltip>
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
import MinFilter from "../filters/MinFilter";
import MaxFilter from "../filters/MaxFilter";

import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  name: "filters",
  computed: {
    ...mapState(["openFilters", "availableFilters", "multiFilters"]),
    ...mapGetters(["studentCount"])
  },
  data() {
    return {
      info: {}
    };
  },
  methods: {
    ...mapMutations(["addFilter"])
  },
  components: {
    SizeFilter,
    TimeZoneFilter,
    AgeFilter,
    GenderFilter,
    MinFilter,
    MaxFilter
  }
};
</script>

<style>
</style>