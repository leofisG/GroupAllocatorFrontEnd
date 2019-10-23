<template>
  <v-card width="100%">
    <v-card-title class="justify-center">
      Ages
      <v-btn @click="this.remove" absolute right fab dark x-small>
        <v-icon dark>mdi-minus</v-icon>
      </v-btn>
    </v-card-title>
    <v-list-item>
      <v-select v-model="ageType" :items="['Same', 'Different']" label="Filter type"></v-select>
    </v-list-item>
    <v-list-item>
      <v-text-field
        v-if="ageType == &quot;Different&quot;"
        type="number"
        min="0"
        label="Age difference"
        clearable
        v-model="ageDiff"
        @change="validateAge"
      ></v-text-field>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: "agefilter",
  data: function() {
    return {
      ageType: "Same",
      ageDiff: 1
    };
  },
  watch: {
    ageType: function() {
        this.updateFilters()
    },
    ageDiff: function() {
      this.updateFilters();
    }
  },
  mounted: function() {
    this.updateFilters();
  },
  methods: {
    validateAge() {
      if (this.ageDiff < 0) {
        this.ageDiff = 0;
      }
      if (this.ageDiff > 70) {
        this.ageDiff = 70;
      }
    },
    remove() {
      this.$emit("remove", {
        type: "AgeFilter",
        values: ["ageDiff"]
      });
    },
    updateFilters() {
      const values =
        this.ageType == "Same"
          ? {
              ageDiff: 0
            }
          : {
              ageDiff: this.ageDiff
            };
      this.$emit("update", values);
    }
  }
};
</script>

<style>
</style>