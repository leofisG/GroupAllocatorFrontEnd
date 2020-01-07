import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as mutations from './mutations'

Vue.use(Vuex)

const state = {
  debugURL: "https://organiser-app-dev.herokuapp.com/allocateGroups",
  productionURL: "https://organiser-app.herokuapp.com/allocateGroups",
  usedURL: "https://organiser-app.herokuapp.com/allocateGroups",
  parsedStudents: null,
  parsedHeaders: null,
  filterId: 1,
  fixedFilters: [
    {
      type: "SizeFilter",
      name: "Size",
      tooltip: "Adjust the size of the groups with a fixed or flexible size.",
      id: 0,
      values: {},
      error: false,
      errorMessage: ""
    }
  ],
  removableFilters: [
    {
      type: "TimeZoneFilter",
      name: "Timezone",
      tooltip: "Group people from the same timezone or a range of timezones.",
      id: null,
      values: {},
      error: false,
      errorMessage: ""
    },
    {
      type: "AgeFilter",
      name: "Age",
      tooltip: "Group people with the same age or a range of ages.",
      id: null,
      values: {},
      error: false,
      errorMessage: ""
    },
    {
      type: "GenderFilter",
      name: "Gender",
      tooltip: "Adjust the gender allocation of groups, using limits or percentages.",
      id: null,
      values: {},
      error: false,
      errorMessage: ""
    },
    {
      type: "MinFilter",
      name: "Minimum filter",
      tooltip: "Choose a value and the minimum number of people per group who should have this value.",
      field: null,
      value: null,
      id: null,
      values: {},
      error: false,
      errorMessage: ""
    },
    {
      type: "MaxFilter",
      name: "Maximum filter",
      tooltip: "Choose a field, and the maximum number of people per group who have an identical field value.",
      field: null,
      id: null,
      values: {},
      error: false,
      errorMessage: ""
    }
  ],
  openFilters: [],
  availableFilters: [],
  multiFilters: [ "MinFilter", "MaxFilter" ],
  maxFieldsInUse: [],
  results: null,
  originalResults: null,
  warnings: [],
};

const store = new Vuex.Store({
  state,
  getters,
  mutations
})

export default store;