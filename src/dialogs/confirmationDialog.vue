<template>
  <v-dialog v-model="modelWatcher" max-width="40%">
    <v-card>
      <v-card-title class="headline justify-center">Allocate groups?</v-card-title>
      <v-alert class="mx-5" type="info">Have you chosen the correct filters?</v-alert>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="$emit('close')">back</v-btn>
        <v-btn color="green darken-1" text @click="next">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "confirmation-dialog",
  props: {
    model: Boolean,
    next: Function
  },
  computed: {
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