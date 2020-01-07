<template>
  <v-card width="100%">
    <v-card-title class="justify-center">
      Minimum filter
      <v-btn @click="this.remove" absolute right fab dark x-small>
        <v-icon dark>mdi-minus</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>Select a field, value and the minimum number desired per group.</v-card-text>
    <v-list-item>
      <v-autocomplete
        v-model="selectedField"
        :items="availableMinFields"
        label="Field"
        placeholder="Select a field"
      ></v-autocomplete>
    </v-list-item>
    <v-list-item v-if="selectedField !== &quot;&quot;">
      <v-autocomplete
        v-model="selectedValue"
        :items="availableValues"
        label="Value"
        placeholder="Select a value"
      ></v-autocomplete>
    </v-list-item>
    <v-list-item v-if="selectedValue !== &quot;&quot;">
      <v-text-field
        type="number"
        min="0"
        label="Minimum"
        placeholder="Desired minimum amount"
        clearable
        v-model="selectedMinimum"
        @change="validateMin"
      ></v-text-field>
    </v-list-item>
    <v-list-item v-if="maxError">
      <v-alert dense type="error" style="font-size:0.8em">{{ maxErrorMessage }}</v-alert>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "minfilter",
  props: {
    id: Number
  },
  computed: {
    maxError() {
      return this.openFilters.some(
        f =>
          f.type === "MaxFilter" &&
          f.values &&
          f.values.field === this.selectedField &&
          f.values.maximum < this.selectedMinimum
      );
    },
    filter() {
      return this.$store.getters.getFilter(this.id);
    },
    filters() {
      return this.$store.getters.baseFilters;
    },
    fieldValue() {
      return this.parsedHeaders.find(h => h.text === this.selectedField).value;
    },
    availableValues() {
      return this.parsedHeaders.find(h => h.text === this.selectedField)
        .uniqueValues;
    },
    availableMinFields() {
      return this.$store.getters.availableMinFields(this.selectedField);
    },
    ...mapState(["parsedHeaders", "openFilters"]),
    ...mapGetters(["studentCount"])
  },
  watch: {
    maxError() {
      if (this.maxError) {
        this.$store.commit("setWarning", {
          id: this.id,
          value: true,
          message: this.maxErrorMessage
        });
      } else {
        this.$store.commit("setWarning", {
          id: this.id,
          value: false,
          message: ""
        });
      }
    },
    selectedField() {
      if (!(this.availableValues.includes(this.selectedValue))) {
        this.selectedValue = "";
      }
    },
    selectedValue() {
      this.updateFilters();
    },
    selectedMinimum() {
      this.updateFilters();
    }
  },
  data() {
    return {
      selectedField: "",
      selectedValue: "",
      selectedMinimum: 1,
      maxErrorMessage:
        "You have a corresponding maximum filter with a value below this minimum!"
    };
  },
  mounted() {
    const filter = this.filter;
    if (filter.values) {
      if (filter.values.field !== undefined) {
        console.log("Here");
        this.selectedField = filter.values.field;
      }
      if (filter.values.value !== undefined) {
        console.log("Here2");
        this.selectedValue = filter.values.value;
      }
      if (!isNaN(filter.values.minimum)) {
        console.log("Here3");
        this.selectedMinimum = filter.values.minimum;
      }
    }
    console.log(this.selectedValue);
    this.updateFilters();
  },
  methods: {
    validateMin() {
      if (this.selectedMinimum < 0) {
        this.selectedMinimum = 0;
      }
      if (this.selectedMinimum >= this.studentCount) {
        this.selectedMinimum = this.studentCount - 1;
      }
    },
    remove() {
      this.$store.commit("removeFilter", this.id);
    },
    updateFilters() {
      if (
        this.selectedField === "" ||
        this.selectedValue === "" ||
        isNaN(this.selectedMinimum)
      ) {
        return;
      }
      const values = {
        field: this.selectedField,
        convertedName: this.parsedHeaders.find(
          h => h.text === this.selectedField
        ).value,
        value: this.selectedValue,
        minimum: this.selectedMinimum
      };
      this.$store.commit("updateFilter", { id: this.id, values });
    }
  }
};
</script>
<style>
</style>
