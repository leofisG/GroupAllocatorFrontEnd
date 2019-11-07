export const checkAll = (group, filters) => {
    const validities = [];
    validities.push(checkSize(group, filters));
    // if ("timezoneDiff" in filters) {
    //     validities.push(checkTimeZone(group, filters))
    // }
    if ("ageDiff" in filters) {
        validities.push(checkAge(group, filters));
    }
    if ("sameGender" in filters || "genderRatio" in filters || "minMale" in filters) {
        validities.push(checkGender(group, filters))
    }
    return validities;
}

export const checkSize = (group, filters) => {
    var status = true;
    var message = `Group size is ${filters.groupSizeUpperBound}`
    if (filters.groupSizeLowerBound != filters.groupSizeUpperBound) {
        message = `Group size is between ${filters.groupSizeLowerBound} and ${filters.groupSizeUpperBound}`
    }
    if (group.length < filters.groupSizeLowerBound) {
        status = false
    }
    if (group.length > filters.groupSizeUpperBound) {
        status = false
    }
    return {
        status,
        message
    }
}

// export const checkTimeZone = (group, filters) => {
//     //TODO
//     console.log("Not implemented")
// }

export const checkAge = (group, filters) => {
    var status = true
    var message = `Ages differ by ${filters.ageDiff} years`
    var minAge = Infinity;
    var maxAge = 0;
    for (const student of group) {
        if (student.age < minAge) {
            minAge = student.age
        }
        if (student.age > maxAge) {
            maxAge = student.age
        }
    }
    if (filters.ageDiff == 0) {
        message = `Same ages`;
        if (maxAge - minAge != 0) {
            status = false;
        }
    } else {
        status = (maxAge - minAge) <= filters.ageDiff;
    }
    return {
        status, message
    }
}

export const checkGender = (group, filters) => {
    var status = true;
    var message = "Group consists of same genders";
    if ("sameGender" in filters) {
        const gender = group[0].gender;
        for (const student of group) {
            if (student.gender != gender) {
                status = false;
                break;
            }
        }
    } else if ("genderRatio" in filters) {
        var maleCount = 0;
        for (const student of group) {
            if (student.gender == "Male") {
                maleCount ++;
            }
        }
        const ratio = maleCount / group.length
        const lowerBound = filters.genderRatio - filters.genderErrorMargin;
        const upperBound = filters.genderRatio + filters.genderErrorMargin;
        message = `Male:Female ratio is between ${lowerBound} and ${upperBound}`
        status = ratio >= lowerBound && ratio <= upperBound;
    } else {
        //eslint-disable-next-line
        var maleCount = 0;
        var femaleCount = 0;
        for (const student of group) {
            if (student.gender == "male") {
                maleCount ++;
            } else {
                femaleCount ++;
            }
        }
        status = maleCount >= filters.minMale && femaleCount >= filters.minFemale;
        message = "At least ";
        if (filters.minMale == 1) {
            message += "one man and "
        } else if (filters.minMale > 1) {
            message += `${filters.minMale} men and `
        }
        if (filters.minFemale == 1) {
            message += "one woman per group."
        } else if (filters.minFemale > 1) {
            message += `${filters.minFemale} women per group.`
        }
    }
    return {
        status, message
    }
}