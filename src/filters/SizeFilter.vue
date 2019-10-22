<template>
  <v-card width="100%">
    <v-card-title class="justify-center">Group size</v-card-title>
    <v-list-item>
      <v-select v-model="groupSizeType" :items="['Fixed', 'Variable']" label="Filter type"></v-select>
    </v-list-item>
    <v-list-item>
      <v-text-field
        v-if="groupSizeType == &quot;Fixed&quot;"
        type="number"
        min="1"
        label="Group size"
        clearable
        v-model="fixedGroupSize"
        @change="validateGroupSize"
      ></v-text-field>
      <v-range-slider
        v-if="groupSizeType != &quot;Fixed&quot;"
        v-model="variableGroupRange"
        :max="groupSizeUpperBound"
        :min="groupSizeLowerBound"
        :thumb-size="24"
        thumb-label="always"
      >
        <template v-slot:prepend>
          <v-text-field
            @change="validateGroupLowerBound"
            v-model="groupSizeLowerBound"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 50px"
          ></v-text-field>
        </template>
        <template v-slot:append>
          <v-text-field
            @change="validateGroupUpperBound"
            v-model="groupSizeUpperBound"
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
export default {
  name: "sizefilter",
  props: {
    studentAmount: Number
  },
  data: function() {
    return {
      groupSizeType: "Fixed",
      fixedGroupSize: 2,
      variableGroupRange: [2, 6],
      groupSizeLowerBound: 1,
      groupSizeUpperBound: 6
    };
  },
  mounted: function() {
    this.updateFilters();
  },
  methods: {
    validateGroupSize() {
      if (this.fixedGroupSize <= 1) {
        this.fixedGroupSize = 2;
      }
      if (this.fixedGroupSize >= this.studentAmount) {
        this.fixedGroupSize = this.studentAmount - 1;
      }
      this.updateFilters();
    },
    validateGroupLowerBound() {
      if (this.groupSizeLowerBound <= 0) {
        this.groupSizeLowerBound = 1;
      }
      if (this.groupSizeLowerBound >= this.groupSizeUpperBound) {
        this.groupSizeLowerBound = this.groupSizeUpperBound - 1;
      }
      if (this.groupSizeLowerBound >= this.studentAmount - 1) {
        this.groupSizeLowerBound = this.studentAmount - 2;
      }
      this.validateGroupRange();
    },
    validateGroupUpperBound() {
      if (this.groupSizeUpperBound <= 0) {
        this.groupSizeUpperBound = 2;
      }
      if (this.groupSizeUpperBound <= this.groupSizeLowerBound) {
        this.groupSizeUpperBound = this.groupSizeLowerBound + 1;
      }
      if (this.groupSizeUpperBound >= this.studentAmount) {
        this.groupSizeUpperBound = this.studentAmount - 1;
      }
      this.validateGroupRange();
    },
    validateGroupRange() {
      if (this.variableGroupRange[0] < this.groupSizeLowerBound) {
        this.variableGroupRange[0] = this.groupSizeLowerBound;
      }
      if (this.variableGroupRange[1] > this.groupSizeUpperBound) {
        this.variableGroupRange[1] = this.groupSizeUpperBound;
      }
      this.updateFilters();
    },
    updateFilters() {
      this.$emit("update", {
        ...this.groupSizeLowerBound,
        ...this.groupSizeUpperBound
      });
    }
  }
};
</script>

<style>
</style>