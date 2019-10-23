<template>
  <v-card width="100%">
    <v-card-title class="justify-center">
      Gender
      <v-btn @click="this.remove" absolute right fab dark x-small>
        <v-icon dark>mdi-minus</v-icon>
      </v-btn>
    </v-card-title>
    <v-list-item>
      <v-select
        v-model="genderType"
        :items="['Same genders', 'Ratio-based', 'Minimum of each']"
        label="Filter type"
      ></v-select>
    </v-list-item>
    <v-list-item>
      <v-slider
        v-if="genderType == &quot;Ratio-based&quot;"
        :rules="ratioRules"
        step="5"
        min="0"
        max="100"
        label="Men:Women"
        thumb-label="always"
        v-model="genderRatio"
      ></v-slider>
      <v-text-field
        v-if="genderType == &quot;Minimum of each&quot;"
        v-model="minMen"
        type="number"
        min="0"
        clearable
      >
        <p slot="prepend">Men:</p>
      </v-text-field>
      <v-text-field
        v-if="genderType == &quot;Minimum of each&quot;"
        v-model="minWomen"
        type="number"
        min="0"
        clearable
      >
        <p slot="prepend">Women:</p>
      </v-text-field>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: "genderfilter",
  data: function() {
    return {
      genderType: "Same",
      genderRatio: 50,
      ratioRules: [
        v => v < 100 || "What about the women?",
        v => v > 0 || "What about the men?"
      ],
      minMen: 0,
      minWomen: 0
    };
  },
  watch: {},
  mounted: function() {
    this.updateFilters();
  },
  methods: {
    remove() {
      this.$emit("remove", {
        type: "GenderFilter",
        values: []
      });
    },
    updateFilters() {}
  }
};
</script>

<style>
</style>