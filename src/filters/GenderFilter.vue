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
import { mapState } from "vuex";

export default {
  name: "genderfilter",
  data: function() {
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
    currentType: function() {
      this.updateWarning();
      this.updateFilters();
    },
    genderRatio: function() {
      this.updateFilters();
    },
    genderErrorMargin: function() {
      this.checkMargin();
      this.updateFilters();
    },
    minMale: function() {
      this.checkMin();
      this.updateFilters();
    },
    minFemale: function() {
      this.checkMin();
      this.updateFilters();
    },
    filters: function() {
      this.checkMargin();
      this.checkMin();
    }
  },
  computed: {
    ...mapState(["filters"]),
    minRatio: function() {
      return Math.ceil(
        (100 *
          (1 -
            this.filters.groupSizeLowerBound /
              this.filters.groupSizeUpperBound)) /
          2
      );
    },
    maxRatio: function() {
      return Math.min(this.genderRatio, 100 - this.genderRatio);
    },
    checkMinVal: function() {
      return (
        parseInt(this.minMale) + parseInt(this.minFemale) >
        this.filters.groupSizeUpperBound
      );
    }
  },
  mounted: function() {
    if ("genderRatio" in this.filters) {
      this.currentType = "Ratio-based";
      // Convert back from decimal to percentage value
      this.genderRatio = Math.round(this.filters.genderRatio * 100);
      this.genderErrorMargin = Math.round(this.filters.genderErrorMargin * 100);
    } else if ("minMale" in this.filters) {
      this.currentType = "Minimum of each";
      this.minMale = this.filters.minMale;
      this.minFemale = this.filters.minFemale;
    } else {
      this.genderErrorMargin = this.minRatio;
      this.updateFilters();
    }
  },
  methods: {
    remove() {
      this.$store.commit("removeFromFilter", this.values);
      this.$store.commit("removeWarning", "Gender");
      this.$store.commit("removeFilter", "GenderFilter");
    },
    checkMargin() {
      if (this.currentType == "Ratio-based") {
        if (!this.isMinRatio()) {
          this.marginErrors = [
            `Your minimum margin should be ${this.minRatio}`
          ];
          this.$store.commit("addWarning", "Gender");
        } else if (!this.isMaxRatio()) {
          this.marginErrors = [
            `Margin cannot be bigger than ${this.maxRatio}!`
          ];
          this.$store.commit("addWarning", "Gender");
        } else {
          this.marginErrors = [];
          this.$store.commit("removeWarning", "Gender");
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
      console.log("in checkmin");
      if (this.currentType == "Minimum of each") {
        if (this.checkMinVal) {
          this.$store.commit("addWarning", "Gender");
        } else {
          this.$store.commit("removeWarning", "Gender");
        }
      }
    },
    updateFilters() {
      this.$store.commit("removeFromFilter", this.values);
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
          values.minMale = this.minMale;
          values.minFemale = this.minFemale;
      }
      this.$store.commit("updateFilters", values);
    },
    updateWarning() {
      console.log("In updateWarning");
      if (this.currentType == "Same genders") {
        this.$store.commit("removeWarning", "Gender");
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