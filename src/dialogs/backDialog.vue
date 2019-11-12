<template>
  <v-dialog v-model="on">
    <v-card>
      <v-card-title class="headline justify-center">Go back to {{ destination }}?</v-card-title>
      <v-alert class="mx-5" type="warning">{{ lossWarning }} will be lost if you do!</v-alert>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="$emit('close')">Stay</v-btn>
        <v-btn color="red" text @click="$emit('back')">Go back</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "back-dialog",
  props: {
    destination: String,
    lossWarning: String
  },
  data: function() {
      return {
          on: true
      }
  }
};
</script>

<style>
</style>