<template>
  <v-card width="100%">
    <v-card-title class="justify-center">Group size</v-card-title>
    <v-list-item>
      <v-select v-model="currentType" :items="groupSizeTypes" label="Filter type"></v-select>
    </v-list-item>
    <v-list-item>
      <v-text-field
        v-if="currentType == &quot;Fixed&quot;"
        type="number"
        min="1"
        label="Group size"
        clearable
        v-model="fixedGroupSize"
        @change="validateGroupSize"
      ></v-text-field>
      <v-range-slider
        v-if="currentType != &quot;Fixed&quot;"
        v-model="variableGroupRange"
        :max="groupSizeUpperLimit"
        :min="groupSizeLowerLimit"
        :thumb-size="24"
        thumb-label="always"
      >
        <template v-slot:prepend>
          <v-text-field
            @change="validateGroupLowerLimit"
            v-model="groupSizeLowerLimit"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 50px"
          ></v-text-field>
        </template>
        <template v-slot:append>
          <v-text-field
            @change="validateGroupUpperLimit"
            v-model="groupSizeUpperLimit"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 50px"
          ></v-text-field>
        </template>
      </v-range-slider>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "sizefilter",
  props: {
    id: Number
  },
  computed: {
    filter() {
      return this.$store.getters.getFilter(this.id);
    },
    ...mapGetters(["studentCount", "baseFilters"])
  },
  watch: {
    currentType() {
      this.updateFilters();
    },
    fixedGroupSize() {
      this.updateFilters();
    },
    variableGroupRange() {
      this.updateFilters();
    }
  },
  data() {
    return {
      currentType: "Fixed",
      groupSizeTypes: ["Fixed", "Variable"],
      fixedGroupSize: 2,
      variableGroupRange: [2, 6],
      groupSizeLowerLimit: 2,
      groupSizeUpperLimit: 6
    };
  },
  mounted() {
    const filter = this.filter;
    if ("groupSizeLowerBound" in filter.values) {
      if (
        filter.values.groupSizeLowerBound ===
        filter.values.groupSizeUpperBound
      ) {
        this.fixedGroupSize = filter.values.groupSizeLowerBound;
      } else {
        this.currentType = "Variable";
        this.groupSizeLowerLimit = filter.values.groupSizeLowerBound;
        this.groupSizeUpperLimit = filter.values.groupSizeUpperBound;
        this.$set(this.variableGroupRange, 0, this.groupSizeLowerLimit);
        this.$set(this.variableGroupRange, 1, this.groupSizeUpperLimit);
      }
    }
    this.updateFilters();
  },
  methods: {
    validateGroupSize() {
      if (this.fixedGroupSize <= 1) {
        this.fixedGroupSize = 2;
      }
      if (this.fixedGroupSize >= this.studentCount) {
        this.fixedGroupSize = this.studentCount - 1;
      }
    },
    validateGroupLowerLimit() {
      if (this.groupSizeLowerLimit <= 1) {
        this.groupSizeLowerLimit = 2;
      }
      if (this.groupSizeLowerLimit >= this.groupSizeUpperLimit) {
        this.groupSizeLowerLimit = this.groupSizeUpperLimit - 1;
      }
      if (this.groupSizeLowerLimit >= this.studentCount - 1) {
        this.groupSizeLowerLimit = this.studentCount - 2;
      }
      this.validateGroupRange();
    },
    validateGroupUpperLimit() {
      if (this.groupSizeUpperLimit <= 0) {
        this.groupSizeUpperLimit = 3;
      }
      if (this.groupSizeUpperLimit <= this.groupSizeLowerLimit) {
        this.groupSizeUpperLimit = this.groupSizeLowerLimit + 1;
      }
      if (this.groupSizeUpperLimit >= this.studentCount) {
        this.groupSizeUpperLimit = this.studentCount - 1;
      }
      this.validateGroupRange();
    },
    validateGroupRange() {
      if (this.variableGroupRange[0] < this.groupSizeLowerLimit) {
        this.$set(this.variableGroupRange, 0, this.groupSizeLowerLimit);
      }
      if (this.variableGroupRange[1] > this.groupSizeUpperLimit) {
        this.$set(this.variableGroupRange, 1, this.groupSizeUpperLimit);
      }
      this.$forceUpdate();
    },
    updateFilters() {
      const values =
        this.currentType === "Fixed"
          ? {
              groupSizeLowerBound: Number(this.fixedGroupSize),
              groupSizeUpperBound: Number(this.fixedGroupSize)
            }
          : {
              groupSizeLowerBound: this.variableGroupRange[0],
              groupSizeUpperBound: this.variableGroupRange[1]
            };
      this.$store.commit("updateFilter", { id: this.id, values });
    }
  }
};
</script>

<style>
</style>