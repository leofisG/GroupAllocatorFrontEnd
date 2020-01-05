<template>
  <v-card width="100%">
    <v-card-title class="justify-center">
      Gender
      <v-btn @click="this.remove" absolute right fab dark x-small>
        <v-icon dark>mdi-minus</v-icon>
      </v-btn>
    </v-card-title>
    <v-list-item>
      <v-select v-model="currentType" :items="genderTypes" label="Filter type"></v-select>
    </v-list-item>
    <v-list-item v-if="currentType != &quot;Same genders&quot;">
      <v-slider
        v-if="currentType == &quot;Ratio-based&quot;"
        :rules="ratioRules"
        step="5"
        min="0"
        max="100"
        label="Men:Women"
        thumb-label="always"
        v-model="genderRatio"
      ></v-slider>
      <v-text-field
        v-if="currentType == &quot;Minimum of each&quot;"
        v-model="minMale"
        type="number"
        min="0"
      >
        <p slot="prepend">Men:</p>
      </v-text-field>
      <v-text-field
        v-if="currentType == &quot;Minimum of each&quot;"
        v-model="minFemale"
        type="number"
        min="0"
      >
        <p slot="prepend">Women:</p>
      </v-text-field>
    </v-list-item>
    <v-list-item v-if="currentType == &quot;Ratio-based&quot;">
      <v-text-field
        v-if="currentType == &quot;Ratio-based&quot;"
        min="0"
        type="number"
        :rules="marginRules"
        :error-messages="marginErrors"
        v-model="genderErrorMargin"
      >
        <p slot="prepend">Error Margin %:</p>
      </v-text-field>
    </v-list-item>
    <v-list-item v-if="currentType == &quot;Minimum of each&quot; && checkMinVal">
      <v-alert dense max-height="50px" type="error" style="font-size:0.8em">{{minErrorMessage}}</v-alert>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: "genderfilter",
  props: {
    id: Number
  },
  data() {
    return {
      currentType: "Same genders",
      genderTypes: ["Same genders", "Ratio-based", "Minimum of each"],
      genderRatio: 50,
      genderErrorMargin: 0,
      marginErrors: [],
      marginRules: [() => this.checkMargin()],
      ratioRules: [
        v => v < 100 || "What about the women?",
        v => v > 0 || "What about the men?"
      ],
      minMale: 0,
      minFemale: 0,
      minErrorMessage: "You cannot have more minimums than the group size!",
      values: [
        "isSameGender",
        "genderRatio",
        "genderErrorMargin",
        "minMale",
        "minFemale"
      ]
    };
  },
  watch: {
    currentType() {
      this.updateWarning();
      this.updateFilters();
    },
    genderRatio() {
      this.updateFilters();
    },
    genderErrorMargin() {
      this.checkMargin();
      this.updateFilters();
    },
    minMale() {
      this.checkMin();
      this.updateFilters();
    },
    minFemale() {
      this.checkMin();
      this.updateFilters();
    },
    filters() {
      this.checkMargin();
      this.checkMin();
    }
  },
  computed: {
    filter() {
      return this.$store.getters.getFilter(this.id);
    },
    filters() {
      return this.$store.getters.baseFilters;
    },
    minRatio() {
      const filters = this.filters;
      return Math.ceil(
        (100 *
          (1 - filters.groupSizeLowerBound / filters.groupSizeUpperBound)) /
          2
      );
    },
    maxRatio() {
      return Math.min(this.genderRatio, 100 - this.genderRatio);
    },
    checkMinVal() {
      return (
        parseInt(this.minMale) + parseInt(this.minFemale) >
        this.filters.groupSizeUpperBound
      );
    }
  },
  mounted() {
    const filter = this.filter;
    if ("genderRatio" in filter.values) {
      this.currentType = "Ratio-based";
      // Convert back from decimal to percentage value
      this.genderRatio = Math.round(filter.values.genderRatio * 100);
      this.genderErrorMargin = Math.round(
        filter.values.genderErrorMargin * 100
      );
    } else if ("minMale" in filter.values) {
      this.currentType = "Minimum of each";
      this.minMale = filter.values.minMale;
      this.minFemale = filter.values.minFemale;
    } else {
      this.genderErrorMargin = this.minRatio;
      this.updateFilters();
    }
  },
  methods: {
    remove() {
      this.$store.commit("removeFilter", this.id);
    },
    checkMargin() {
      if (this.currentType == "Ratio-based") {
        if (!this.isMinRatio()) {
          this.marginErrors = [
            `Your minimum margin should be ${this.minRatio}`
          ];
          this.$store.commit("setWarning", {
            id: this.id,
            value: true
          });
        } else if (!this.isMaxRatio()) {
          this.marginErrors = [
            `Margin cannot be bigger than ${this.maxRatio}!`
          ];
          this.$store.commit("setWarning", {
            id: this.id,
            value: true
          });
        } else {
          this.marginErrors = [];
          this.$store.commit("setWarning", {
            id: this.id,
            value: false
          });
        }
      }
      return true;
    },
    isMinRatio() {
      return this.genderErrorMargin >= this.minRatio;
    },
    isMaxRatio() {
      return this.genderErrorMargin <= this.maxRatio;
    },
    checkMin() {
      if (this.currentType == "Minimum of each") {
        if (this.checkMinVal) {
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
      }
    },
    updateFilters() {
      const values = {};
      switch (this.currentType) {
        case "Same genders":
          values.isSameGender = true;
          break;
        case "Ratio-based":
          values.genderRatio = this.genderRatio / 100;
          values.genderErrorMargin = this.genderErrorMargin / 100;
          break;
        default:
          values.minMale = Number(this.minMale);
          values.minFemale = Number(this.minFemale);
      }
      this.$store.commit("updateFilter", { id: this.id, values });
    },
    updateWarning() {
      if (this.currentType == "Same genders") {
        this.$store.commit("setWarning", {
          id: this.id,
          value: false
        });
      } else if (this.currentType == "Ratio-based") {
        this.checkMargin();
      } else {
        this.checkMin();
      }
    }
  }
};
</script>

<style>
</style>