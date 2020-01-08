<template>
  <v-dialog v-model="modelWatcher" max-width="40%" persistent>
    <v-card>
      <v-card-title v-if="!requestDone" class="headline justify-center">Generating Group Allocation...</v-card-title>
      <v-card-title v-if="requestDone" class="headline justify-center">Allocation successful!</v-card-title>
      <v-alert v-if="requestDone" class="mx-5" type="info">{{ allocationMessage }}</v-alert>
      <v-progress-circular v-if="!requestDone" indeterminate color="primary"></v-progress-circular>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="$emit('close')">Cancel</v-btn>
        <v-btn v-if="requestDone" color="green darken-1" text @click="next">Show results</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "result-dialog",
  props: {
    model: Boolean,
    next: Function
  },
  computed: {
    ...mapState(["requestDone", "allocationMessage"]),
    modelWatcher: {
      get() {
        return this.model;
      },
      set() {
        this.$emit("close");
      }
    }
  }
};
</script>

<style>
</style>