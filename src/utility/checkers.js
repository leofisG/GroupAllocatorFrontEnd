import { minFieldsInUse, maxFieldsInUse } from '../store/getters'

export const checkFilterValidity = (filter, state) => {
    const headers = state.parsedHeaders;
    const openFilters = state.openFilters;
    switch (filter.type) {
        case "TimeZoneFilter":
            return !openFilters.some(f => f.type === filter.type) &&
                headers.some(h => h.value === "country") &&
                headers.some(h => h.value === 'currentCity')
        case "AgeFilter":
            return !openFilters.some(f => f.type === filter.type) &&
                headers.some(h => h.value === "age" &&
                    h.type === "number")
        case "GenderFilter":
            return !openFilters.some(f => f.type === filter.type) && headers.some(h => h.type === "gender")
        case "MinFilter": {
            const minFields = minFieldsInUse(state);
            return headers.filter(h => !minFields.includes(h.value)).some(h => h.type === "string" || h.type === "number" || h.type === "booly")
        }
        case "MaxFilter": {
            const maxFields = maxFieldsInUse(state);
            return headers.filter(h => !maxFields.includes(h.value)).some(h => h.type === "string" || h.type === "number" || h.type === "booly")
        }
        default:
            return false;
    }
}

export const checkAll = (group, openFilters) => {
    const validities = [];
    validities.push(checkSize(group, openFilters.find(f => f.type === "SizeFilter")));
    if (openFilters.some(f => f.type === "TimeZoneFilter")) {
        validities.push(checkTimeZone(group, openFilters.find(f => f.type === "TimeZoneFilter")))
    }
    if (openFilters.some(f => f.type === "AgeFilter")) {
        validities.push(checkAge(group, openFilters.find(f => f.type === "AgeFilter")));
    }
    if (openFilters.some(f => f.type === "GenderFilter")) {
        validities.push(checkGender(group, openFilters.find(f => f.type === "GenderFilter")))
    }
    for (const filter of openFilters.filter(f => f.type === "MinFilter" && f.values && f.values.field && f.values.value && f.values.minimum)) {
        validities.push(checkMinFilter(group, filter));
    }
    for (const filter of openFilters.filter(f => f.type === "MaxFilter" && f.values && f.values.field && f.values.maximum)) {
        validities.push(checkMaxFilter(group, filter));
    }
    return validities;
}

export const checkSize = (group, filter) => {
    let status = true;
    const values = filter.values;
    let message = `Group size is ${values.groupSizeUpperBound}. (Current size: ${group.length})`
    if (values.groupSizeLowerBound != values.groupSizeUpperBound) {
        message = `Group size is between ${values.groupSizeLowerBound} and ${values.groupSizeUpperBound}. (Current size: ${group.length})`
    }
    if (group.length < values.groupSizeLowerBound) {
        status = false
    }
    if (group.length > values.groupSizeUpperBound) {
        status = false
    }
    return {
        status,
        message
    }
}

export const checkTimeZone = (group, filter) => {
    const maxDifference = filter.values.timezoneDiff;
    let status = true;
    let message = "Same timezones."
    if (maxDifference > 0) {
        message = `Timezones differ at most by ${maxDifference} hours.`;
    }
    const currentDiffs = new Set();
    let currentMax = 0;
    for (const student of group) {
        const timezone = student.timezone || 0
        for (const existing of currentDiffs) {
            const difference = getDiff(timezone, existing);
            if (difference > currentMax) {
                currentMax = difference;
            }
            if (difference > maxDifference) {
                status = false;
                break;
            }
        }
        currentDiffs.add(timezone);
    }
    message = message.concat(` (Max difference: ${currentMax})`)
    return {
        status,
        message
    }
}

const getDiff = (zone1, zone2) => {
    const diff = Math.abs(zone1 - zone2);
    return Math.min(diff, 24 - diff);
}

export const checkAge = (group, filter) => {
    const ageDiff = filter.values.ageDiff;
    let status = true
    let message = `Ages differ at most by ${ageDiff} years`
    let minAge = Infinity;
    let maxAge = 0;
    for (const student of group) {
        if (student.age < minAge) {
            minAge = student.age
        }
        if (student.age > maxAge) {
            maxAge = student.age
        }
    }
    if (ageDiff == 0) {
        message = `Same ages`;
        if (maxAge - minAge != 0) {
            status = false;
        }
    } else {
        status = (maxAge - minAge) <= ageDiff;
    }
    message = message.concat(` (Max difference: ${maxAge - minAge})`)
    return {
        status, message
    }
}

Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
}

export const checkGender = (group, filter) => {
    const values = filter.values;
    let status = true;
    let message = "Group consists of same genders";
    if ("isSameGender" in values) {
        const gender = group[0].gender;
        for (const student of group) {
            if (student.gender != gender) {
                status = false;
                break;
            }
        }
    } else if ("genderRatio" in values) {
        let maleCount = 0;
        for (const student of group) {
            if (student.gender == "Male") {
                maleCount++;
            }
        }
        const ratio = maleCount / group.length
        const lowerBound = (values.genderRatio - values.genderErrorMargin).round(2);
        const upperBound = (values.genderRatio + values.genderErrorMargin).round(2);
        if (lowerBound == upperBound) {
            message = `Male:Female ratio is ${lowerBound}. (Current ratio: ${ratio.round(2)})`
        } else {
            message = `Male:Female ratio is between ${lowerBound} and ${upperBound}. (Ratio: ${ratio.round(2)})`
        }
        status = ratio >= lowerBound && ratio <= upperBound;
    } else {
        //eslint-disable-next-line
        let maleCount = 0;
        let femaleCount = 0;
        for (const student of group) {
            if (student.gender == "Male") {
                maleCount++;
            } else {
                femaleCount++;
            }
        }
        status = maleCount >= values.minMale && femaleCount >= values.minFemale;
        message = "At least ";
        if (values.minMale == 1) {
            message += "one man and "
        } else if (values.minMale > 1) {
            message += `${values.minMale} men and `
        }
        if (values.minFemale == 1) {
            message += "one woman per group."
        } else if (values.minFemale > 1) {
            message += `${values.minFemale} women per group.`
        }
        message += ` (Male: ${maleCount}, Female: ${femaleCount})`
    }
    return {
        status, message
    }
}

export const checkMinFilter = (group, filter) => {
    const values = filter.values;
    let count = 0;
    for (const student of group) {
        if (student[values.convertedName] === values.value) {
            count++;
        }
    }
    const status = count >= values.minimum;
    const message = `A minimum of ${values.minimum} with "${values.field}" value: "${values.value}" (Current count: ${count})`;
    return {
        status, message
    }
}

export const isTruthy = value => {
    const truthy = /^(yes|true|1)$/i
    return truthy.test(value);
}

export const propertyIsTruthy = (student, property) => {
    return student[property] !== undefined && isTruthy(student[property]);
}

export const checkMaxFilter = (group, filter) => {
    const values = filter.values;
    const count = new Map();
    let status = true;
    let maxCount = 0;
    let message = `No more than ${values.maximum} students with the same "${values.field}" value.`
    for (const student of group) {
        count.set(student[values.convertedName], (count.get(student[values.convertedName]) || 0) + 1)
    }
    for (const entry of count) {
        if (entry[1] > maxCount) {
            maxCount = entry[1];
        }
        if (entry[1] > values.maximum) {
            status = false;
        }
    }
    message += ` (Max count: ${maxCount})`
    return {
        status, message
    }
}

export const getLocationDisplay = student => {
    let timezone = "";
    if (student.timezone > 0) {
        timezone = `(UTC +${student.timezone})`;
    } else if (student.timezone < 0) {
        timezone = `(UTC ${student.timezone})`;
    } else if (student.timezone == 0) {
        timezone = "(UTC)";
    }
    return timezone;
}

export const isMinMaxHeader = (header, filters) => {
    return filters.some(f =>
        (f.type === "MinFilter" || f.type === "MaxFilter") &&
        f.values && f.values.field && f.values.field === header.text
    );
}