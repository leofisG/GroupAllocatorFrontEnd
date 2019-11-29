<template>
  <span>
    <v-tooltip right color="transparent">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <v-icon v-if="isValid" color="green">mdi-checkbox-marked-circle</v-icon>
          <v-icon v-if="!isValid" color="red">mdi-alert-circle</v-icon>
        </span>
      </template>
      <v-card class="elevation-3">
      <v-list-item v-for="status in validities" v-bind:key="status.name" v-bind:status="status">
        <v-icon class="px-2" v-if="status.status" color="green">mdi-checkbox-marked-circle</v-icon>
        <v-icon class="px-2" v-if="!status.status" color="red">mdi-alert-circle</v-icon>
        {{ status.message }}
      </v-list-item>
      </v-card>
    </v-tooltip>
  </span>
</template>

<script>
import { mapState } from "vuex";
import { checkAll } from "../utility/checkers";

export default {
  name: "group-checker",
  props: {
    group: Array
  },
  computed: {
    isValid() {
      return this.validities.every(e => e.status);
    },
    validities() {
      return checkAll(this.group, this.filters);
    },
    ...mapState(["filters", "openFilters"])
  },
};
</script>

<style>
</style>