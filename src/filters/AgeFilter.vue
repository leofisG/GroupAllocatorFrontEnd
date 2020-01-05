<template>
  <v-card width="100%">
    <v-card-title class="justify-center">
      Ages
      <v-btn @click="this.remove" absolute right fab dark x-small>
        <v-icon dark>mdi-minus</v-icon>
      </v-btn>
    </v-card-title>
    <v-list-item>
      <v-select v-model="currentType" :items="ageTypes" label="Filter type"></v-select>
    </v-list-item>
    <v-list-item v-if="currentType == &quot;Different&quot;">
      <v-text-field
        type="number"
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
  props: {
    id: Number
  },
  computed: {
    filter() {
      return this.$store.getters.getFilter(this.id);
    },
  },
  data() {
    return {
      currentType: "Same",
      ageTypes: ["Same", "Different"],
      ageDiff: 0
    };
  },
  watch: {
    currentType() {
      this.validateAge();
      this.updateFilters();
    },
    ageDiff() {
      this.updateFilters();
    }
  },
  mounted() {
    if ("ageDiff" in this.filter && this.filter.ageDiff > 0) {
      this.currentType = "Different";
      this.ageDiff = this.filter.ageDiff;
    } else {
      this.updateFilters();
    }
  },
  methods: {
    validateAge() {
      if (this.currentType == "Different") {
        if (this.ageDiff < 1) {
          this.ageDiff = 1;
        }
        if (this.ageDiff > 100) {
          this.ageDiff = 100;
        }
      }
    },
    remove() {
      this.$store.commit("removeFilter", this.id);
    },
    updateFilters() {
      const values =
        this.currentType == "Same"
          ? {
              ageDiff: 0
            }
          : {
              ageDiff: Number(this.ageDiff)
            };
      this.$store.commit("updateFilter", { id: this.id, values });
    }
  }
};
</script>

<style>
</style>