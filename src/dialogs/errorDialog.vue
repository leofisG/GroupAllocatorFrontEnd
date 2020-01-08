<template>
  <v-dialog v-model="modelWatcher" max-width="40%">
    <v-card>
      <v-card-title class="headline justify-center">Server error occured!</v-card-title>
      <v-card-text>Status: {{ requestError.status }}</v-card-text>
      <v-card-text>Message: {{ requestError.message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="$emit('close')">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="next">Try again</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: "error-dialog",
  props: {
    model: Boolean,
    next: Function
  },
  computed: {
    ...mapState(["requestError"]),
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