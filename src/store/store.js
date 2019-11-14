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
  filters: {},
  fixedFilters: [
    {
      type: "SizeFilter",
      name: "Size"
    }
  ],
  removableFilters: [
    {
      type: "TimeZoneFilter",
      name: "Timezone"
    },
    {
      type: "AgeFilter",
      name: "Age"
    },
    {
      type: "GenderFilter",
      name: "Gender"
    }
  ],
  openFilters: [],
  availableFilters: [],
  results: null,
  originalResults: null,
  warnings: [],
  isAuthenticated: false,
};

const store = new Vuex.Store({
  state,
  getters,
  mutations
})

export default store;