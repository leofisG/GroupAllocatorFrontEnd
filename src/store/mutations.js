import { cloneDeep } from 'lodash';
import { checkFilterValidity } from '../utility/checkers';
import { baseFilters } from './getters'

export const setparsedStudents = (state, result) => {
    state.parsedStudents = result;
}

export const setParsedHeaders = (state, headers) => {
    state.parsedHeaders = headers;
}

export const removeResults = state => {
    state.results = null;
}

export const storeResults = (state, results) => {
    state.results = results;
}

export const updateResultStudents = (state, students) => {
    state.results = { ...state.results, students: students };
    state.originalResults = cloneDeep(state.results);
}

export const resetResults = state => {
    state.results = cloneDeep(state.originalResults);
}

export const prepareFilters = state => {
    state.openFilters = cloneDeep(state.fixedFilters);
    recalculateAvailableFilters(state);
    state.filterId = 1;
}

export const recalculateAvailableFilters = state => {
    state.availableFilters = cloneDeep(state.removableFilters).filter(f => checkFilterValidity(f, state));
}

export const addFilter = (state, filter) => {
    const newFilter = cloneDeep(filter);
    newFilter.id = state.filterId;
    state.filterId += 1;
    state.openFilters.push(newFilter);
    recalculateAvailableFilters(state);
}

export const removeFilter = (state, id) => {
    state.openFilters = state.openFilters.filter(e => e.id !== id);
    recalculateAvailableFilters(state);
}

export const updateFilter = (state, payload) => {
    const index = state.openFilters.findIndex(f => f.id === payload.id);
    if (index !== -1) {
        state.openFilters[index].values = payload.values;
    }
    console.log(baseFilters(state));
}

export const setWarning = (state, payload) => {
    const index = state.openFilters.findIndex(f => f.id === payload.id);
    if (index !== -1) {
        state.openFilters[index].error = payload.value;
        state.openFilters[index].errorMessage = payload.message;
    }
}

export const updateURL = (state, index) => {
    if (index == 0) {
        state.usedURL = state.productionURL
    } else {
        state.usedURL = state.debugURL
    }
}
