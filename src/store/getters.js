import store from './store';
import { isTruthy, getLocationDisplay, isMinMaxHeader } from '../utility/checkers';
import { cloneDeep } from 'lodash';

export const studentCount = state => state.parsedStudents.length

export const firstStudent = state => state.parsedStudents[0];

export const rightURL = state => state.usedURL;

export const availableMinFields = state => currentAttribute => {
    const minFields = minFieldsInUse(state).filter(f => currentAttribute === undefined || f !== currentAttribute);
    return state.parsedHeaders.filter(h => !minFields.includes(h.text) && h.type === "string" || h.type === "number" || h.type === "booly").map(h => h.text)
}

export const availableMaxFields = state => currentAttribute => {
    const maxFields = maxFieldsInUse(state).filter(f => currentAttribute === undefined || f !== currentAttribute);
    return state.parsedHeaders.filter(h => !maxFields.includes(h.text) && h.type === "string" || h.type === "number" || h.type === "booly").map(h => h.text)
}

export const getFilter = (state) => (id) => {
    return state.openFilters.find(f => f.id === id);
}

export const baseFilters = state => {
    const values = state.openFilters.filter(f => !(f.type === "MinFilter" || f.type === "MaxFilter")).map(f => f.values);
    return Object.assign({}, ...values);
}

export const minFieldsInUse = state => {
    return state.openFilters.filter(f => f.type === "MinFilter" && f.values && f.values.field).map(f => f.values.field);
}

export const maxFieldsInUse = state => {
    return state.openFilters.filter(f => f.type === "MaxFilter" && f.values && f.values.field).map(f => f.values.field);
}

export const filterWarnings = state => {
    return state.openFilters.filter(f => f.error).map(f => f.type);
}

export const requestData = state => {
    let filters = baseFilters(state);
    const headers = store.state.parsedHeaders;
    const students = cloneDeep(store.state.parsedStudents);
    // Transform filters into custom data for backend processing
    const openFilters = state.openFilters;
    let minValues = openFilters.filter(
        f => f.type === "MinFilter" &&
            f.values && f.values.field
            && f.values.value
    ).map(f => f.values)
    let maxValues = openFilters.filter(
        f => f.type === "MaxFilter" &&
            f.values &&
            f.values.field
    ).map(f => f.values)
    // For those min/max filters where type is booly and "true" was selected
    // We can combine min/Max ranges
    const minAndMax = minValues.filter(min =>
        min.value &&
        isTruthy(min.value) &&
        headers.some(h => h.text === min.field && h.type === "booly") &&
        maxValues.some(max => max.field === min.field))
        // For each find its partner
        .map(min => ({
            convertedName: min.convertedName,
            minimum: min.minimum,
            maximum: maxValues.find(max => max.field === min.field).maximum
        }));
    for (const value of minAndMax) {
        filters[value.convertedName] = `${value.minimum}, ${value.maximum}`;
    }
    // Ensure those fields are converted to true/false
    for (const student of students) {
        for (const value of minAndMax) {
            student[value.convertedName] = isTruthy(student[value.convertedName]) ? "true" : "false";
        }
    }
    // Remove minAndMax ones from minValues and maxValues
    minValues = minValues.filter(min => !minAndMax.some(minAndMax => minAndMax.convertedName === min.convertedName))
    maxValues = maxValues.filter(max => !minAndMax.some(minAndMax => minAndMax.convertedName === max.convertedName))
    for (const value of minValues) {
        // Convert non-booly types of min-filter into booly types
        const header = headers.find(h => h.text === value.field);
        if (header.type === "booly" && isTruthy(value.value)) {
            filters[value.convertedName] = `${value.minimum}, ${filters.groupSizeUpperBound}`;
            for (const student of students) {
                student[value.convertedName] = student[value.convertedName] === value.value ? "true" : "false";
            }
        } else {
            const newName = `${value.convertedName}_is_${value.value.replace(/\s/i, "_")}`
            filters[newName] = `${value.minimum}, ${filters.groupSizeUpperBound}`;
            for (const student of students) {
                student[newName] = student[value.convertedName] === value.value ? "true" : "false";
            }
        }
    }
    for (const value of maxValues) {
        filters[value.convertedName] = `0, ${value.maximum}`
    }
    return {
        filters,
        students
    }
}

const validFilterHeaders = new Map([
    // ["id", () => true],
    ["firstName", () => true],
    ["lastName", () => true],
    ["gender", filters => filters.some(f => f.type === "GenderFilter")],
    ["age", filters => filters.some(f => f.type === "AgeFilter")],
]);

export const filterHeaders = state => {
    const filters = state.openFilters;
    const headers = state.parsedHeaders.filter(h =>
        (validFilterHeaders.has(h.value) && validFilterHeaders.get(h.value)(filters)) ||
        isMinMaxHeader(h, filters)
    );
    if (state.results && state.results.students[0].timezone !== undefined) {
        headers.push({
            text: "Timezone",
            value: null,
            function: i => getLocationDisplay(i)
        })
    }
    console.log(headers);
    return headers;
}

// Convert fields back to original headers
export const studentsForDownload = state => {
    const headers = state.parsedHeaders;
    const students = state.results.students;
    const convertedStudents = []
    for (const student of students) {
        const newStudent = {};
        newStudent["Group ID"] = student.groupId;
        for (const field in student) {
            const header = headers.find(h => h.value === field);
            if (header !== undefined) {
                newStudent[header.text] = student[field];
            }
        }
        convertedStudents.push(newStudent);
    }
    return convertedStudents.sort((a, b) => a["Group ID"] - b["Group ID"])
}