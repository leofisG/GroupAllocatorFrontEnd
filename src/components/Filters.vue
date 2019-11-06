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
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  name: "filters",
  computed: {
    ...mapState(["filters", "openFilters", "availableFilters"]),
    ...mapGetters(["studentCount"])
  },
  data: function() {
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
    GenderFilter
  }
};
</script>

<style>
</style>