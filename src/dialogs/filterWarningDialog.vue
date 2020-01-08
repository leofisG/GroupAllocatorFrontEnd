<template>
  <v-dialog v-model="modelWatcher" max-width="40%">
    <v-card>
      <v-card-title class="headline justify-center">Critical error in filters prevents allocation!</v-card-title>
      <v-alert
        class="mx-5"
        type="error"
      >Please correct errors in the following filters and try again:</v-alert>
      <v-list>
        <v-list-item v-for="warning in filterWarnings" :key="warning.id" :v-bind:warning="warning">
          <v-list-item-content>
            <v-list-item-title>{{ warning.type }}</v-list-item-title>
            <v-list-item-subtitle>{{ warning.errorMessage }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="$emit('close')">back</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "warning-dialog",
  props: {
    model: Boolean
  },
  computed: {
    ...mapGetters(["filterWarnings"]),
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

