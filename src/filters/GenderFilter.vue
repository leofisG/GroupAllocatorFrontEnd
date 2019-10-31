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
    <v-list-item v-if="genderType != &quot;Same genders&quot;">
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
        v-model="minMale"
        type="number"
        min="0"
      >
        <p slot="prepend">Men:</p>
      </v-text-field>
      <v-text-field
        v-if="genderType == &quot;Minimum of each&quot;"
        v-model="minFemale"
        type="number"
        min="0"
      >
        <p slot="prepend">Women:</p>
      </v-text-field>
    </v-list-item>
    <v-list-item v-if="genderType == &quot;Ratio-based&quot;">
      <v-text-field
        v-if="genderType == &quot;Ratio-based&quot;"
        min="0"
        type="number"
        :rules="marginRules"
        :error-messages="marginErrors"
        v-model="genderErrorMargin"
      >
        <p slot="prepend">Error Margin %:</p>
      </v-text-field>
    </v-list-item>
    <v-list-item v-if="genderType == &quot;Minimum of each&quot; && checkMinVal">
       <v-alert
        dense
        outlined
        max-height="50px"
        type="error"
        style="font-size:0.8em"
      >
        {{minErrorMessage}}
      </v-alert>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: "genderfilter",
  props: {
    filters: Object
  },
  data: function() {
    return {
      genderType: "Same genders",
      genderRatio: 50,
      genderErrorMargin: 0,
      marginErrors: [],
      marginRules: [
        () => this.checkMargin()
      ],
      ratioRules: [
        v => v < 100 || "What about the women?",
        v => v > 0 || "What about the men?"
      ],
      minMale: 0,
      minFemale: 0,
      minErrorMessage: "You cannot have more minimums than the group size!",
      values: ['genderRatio', 'genderErrorMargin', 'minMale', 'minFemale']
    };
  },
  watch: {
    genderType: function() {
      this.updateWarning()
      this.updateFilters()
    },
    genderRatio: function() {
      this.updateFilters();
    },
    genderErrorMargin: function() {
      this.checkMargin();
      this.updateFilters()
    },
    minMale: function() {
      this.checkMin()
      this.updateFilters()
    },
    minFemale: function() {
      this.checkMin()
      this.updateFilters()
    },
    filters: function() {
      this.checkMargin();
    }
  },
  computed: {
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
      return parseInt(this.minMale) + parseInt(this.minFemale) > this.filters.groupSizeUpperBound
    }
  },
  mounted: function() {
    this.updateFilters();
    this.genderErrorMargin = this.minRatio;
  },
  methods: {
    remove() {
      this.$emit("remove", {
        type: "GenderFilter",
        values: this.values
      });
    },
    checkMargin() {
      if (!this.isMinRatio()) {
        this.marginErrors = [`Your minimum ratio should be ${this.minRatio}`];
        this.$emit('warn', "Gender")
      } else if (!this.isMaxRatio()) {
        this.marginErrors = [`Margin cannot be bigger than ${this.maxRatio}!`];
        this.$emit('warn', "Gender")
      } else {
        this.marginErrors = []
        this.$emit('unwarn', "Gender")
      }
      return true
    },
    isMinRatio() {
      return this.genderErrorMargin >= this.minRatio;
    },
    isMaxRatio() {
      return this.genderErrorMargin <= this.maxRatio;
    },
    checkMin() {
      if (this.checkMinVal) {
        console.log("Here")
        this.$emit('warn', "Gender")
      } else {
        this.$emit('unwarn', "Gender")
      }
    },
    updateFilters() {
      this.$emit('removeValues', this.values)
      const values = {}
      switch (this.genderType) {
        case "Same genders":
          values.genderRatio = 1
          values.genderErrorMargin = 0
          break;
        case "Ratio-based":
          values.genderRatio = this.genderRatio / 100
          values.genderErrorMargin = this.genderErrorMargin / 100
          break;
        default:
          values.minMale   = this.minMale
          values.minFemale = this.minFemale
      }
      this.$emit('update', values)
    },
    updateWarning() {
      if (this.genderType == "Same genders") {
        this.$emit('unwarn', "Gender")
      } else if (this.genderType == "Ratio-based") {
        this.checkMargin()
      } else {
        this.checkMin()
      }
    }
  }
};
</script>

<style>
</style>