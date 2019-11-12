import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as mutations from './mutations'

Vue.use(Vuex)

const state = {
  debugURL: "",
  productionURL: "https://organiser-app.herokuapp.com/allocateGroups",
  parsedStudents: null,
  parsedHeaders: null,
  filters: {},
  openFilters: [
    {
      type: "SizeFilter",
      name: "Size"
    }
  ],
  availableFilters: [
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
  results: null,
  originalResults: null,
  warnings: []
};

const store = new Vuex.Store({
  state,
  getters,
  mutations
})

export default store;