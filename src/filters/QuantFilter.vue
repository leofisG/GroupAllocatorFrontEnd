<template>
  <v-card width="100%">
    <v-card-title class="justify-center">Min Quant
      <v-btn @click="this.remove" absolute right fab dark x-small>
        <v-icon dark>mdi-minus</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      Specify the minimum number of students with quantitaive background here.
    </v-card-text>
    <v-list-item>
      <v-text-field
        type="number"
        min="0"
        label="Min Quant"
        clearable
        v-model="minQuant"
        @change="validateMinQuant"
      ></v-text-field>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "quantfilter",
  computed: {
    ...mapState(["filters"]),
    ...mapGetters(["studentCount"])
  },
  watch: {
    minQuant: function() {
      this.updateFilters();
    },
  },
  data: function() {
    return {
      minQuant: 1,
    };
  },
  mounted: function() {
    if ("quant" in this.filters) {
      this.minQuant = parseInt(this.filters.quant.split(",")[0])
    }
    this.updateFilters();
  },
  methods: {
    validateMinQuant() {
      if (this.minQuant < 0) {
        this.minQuant = 0;
      }
      if (this.minQuant >= this.studentCount) {
        this.minQuant = this.studentCount - 1;
      }
    },
    remove() {
      this.$store.commit("removeFromFilter", ["quant"])
      this.$store.commit("removeFilter", "QuantFilter");
    },
    updateFilters() {
      const values =
            {
              quant: `${this.minQuant}, ${this.filter.groupSizeUpperBound}`,
            };
      this.$store.commit("updateFilters", values);
    }
  }
};
</script>

<style>
</style>