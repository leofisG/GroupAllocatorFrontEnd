import Vue from 'vue'
import { cloneDeep } from 'lodash';

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
    state.results = state.originalResults;
    state.originalResults = cloneDeep(state.originalResults);
}

export const clearFilters = state => {
    state.filters = {};
}

export const removeFromFilter = (state, values) => {
    for (const value of values) {
        if (value in state.filters) {
            Vue.delete(state.filters, value)
        }
    }
}

export const updateFilters = (state, values) => {
    state.filters = { ...state.filters, ...values }
}

export const addFilter = (state, filter) => {
    state.availableFilters = state.availableFilters.filter(e => e != filter);
    state.openFilters.push(filter);
}

export const removeFilter = (state, name) => {
    const filter = state.openFilters.find(e => e.type == name);
    state.openFilters = state.openFilters.filter(e => e.type != name);
    state.availableFilters.push(filter);
}

export const addWarning = (state, warning) => {
    console.log("Adding " + warning);
    if (!state.warnings.includes(warning)) {
        state.warnings.push(warning);
    }
}

export const removeWarning = (state, warning) => {
    console.log("Removing " + warning);
    state.warnings = state.warnings.filter(e => e != warning)
}

export const clearWarnings = state => {
    state.warnings = [];
}

export const updateDebugURL = (state, url) => {
    state.debugURL = url;
}