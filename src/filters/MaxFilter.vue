<template>
  <v-card width="100%">
    <v-card-title class="justify-center">
      Maximum filter
      <v-btn @click="this.remove" absolute right fab dark x-small>
        <v-icon dark>mdi-minus</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>Specify a field and the maximum desired number of identical values per group.</v-card-text>
    <v-list-item>
      <v-autocomplete
        v-model="selectedField"
        :items="availableMaxFields"
        label="Field"
        placeholder="Select a field"
      ></v-autocomplete>
    </v-list-item>
    <v-list-item v-if="selectedField !== &quot;&quot;">
      <v-text-field
        type="number"
        min="1"
        label="Maximum"
        placeholder="Desired maximum amount"
        clearable
        v-model="selectedMaximum"
        @change="validateMax"
      ></v-text-field>
    </v-list-item>
    <v-list-item v-if="minError">
      <v-alert dense type="error" style="font-size:0.8em">{{ minErrorMessage }}</v-alert>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "maxfilter",
  props: {
    id: Number
  },
  computed: {
    minError() {
      return this.openFilters.some(
        f =>
          f.type === "MinFilter" &&
          f.values &&
          f.values.field === this.selectedField &&
          f.values.minimum > this.selectedMaximum
      );
    },
    availableMaxFields() {
      return this.$store.getters.availableMaxFields(this.selectedField);
    },
    ...mapState(["openFilters", "parsedHeaders"]),
    ...mapGetters(["studentCount"])
  },
  watch: {
    minError() {
      if (this.minError) {
        this.$store.commit("setWarning", {
          id: this.id,
          value: true
        });
      } else {
        this.$store.commit("setWarning", {
          id: this.id,
          value: false
        });
      }
    },
    selectedField() {
      this.updateFilters();
    },
    selectedMaximum() {
      this.updateFilters();
    }
  },
  data() {
    return {
      selectedField: "",
      selectedMaximum: 1,
      minErrorMessage:
        "You have a corresponding minimum filter with a value above this maximum!"
    };
  },
  mounted() {
    this.updateFilters();
  },
  methods: {
    validateMax() {
      if (this.selectedMaximum <= 1) {
        this.selectedMaximum = 1;
      }
      if (this.selectedMaximum >= this.studentCount) {
        this.selectedMaximum = this.studentCount - 1;
      }
    },
    remove() {
      this.$store.commit("removeFilter", this.id);
    },
    updateFilters() {
      if (this.selectedField === "" || isNaN(this.selectedMaximum)) {
        return;
      }
      const values = {
        field: this.selectedField,
        convertedName: this.parsedHeaders.find(h => h.text === this.selectedField).value,
        maximum: this.selectedMaximum
      };
      this.$store.commit("updateFilter", { id: this.id, values });
    }
  }
};
</script>

<style>
</style>