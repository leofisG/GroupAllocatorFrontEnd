<template>
  <span>
    <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
    <v-tooltip right v-if="!loading" color="transparent">
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
  watch: {
    group() {
      this.checkValidity();
    }
  },
  data() {
    return {
      loading: true,
      isValid: false,
      validities: []
    };
  },
  computed: {
    ...mapState(["filters", "openFilters"])
  },
  methods: {
    checkValidity() {
      this.validities = checkAll(this.group, this.filters);
      this.isValid = this.validities.every(e => e.status);
      this.loading = false;
    }
  },
  mounted() {
    this.checkValidity();
  }
};
</script>

<style>
</style>