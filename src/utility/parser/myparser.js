import Papa from 'papaparse'
import store from '../../store/store'

const restrictedKeyWords = ["groupSizeLowerBound", "groupSizeUpperBound", "ageDiff", "timeZoneDiff", "isSameGender", "genderRatio", "genderErrorMargin", "minMale", "minFemale"]
let coreAttributes = [
    {
        regex: /^first\s*name$/i,
        canonicalName: "First name",
        mappedName: "firstName",
        type: "string"
    },
    {
        regex: /^last\s*name$/i,
        canonicalName: "Last name",
        mappedName: "lastName",
        type: "string"
    },
    {
        regex: /^age$/i,
        canonicalName: "Age",
        mappedName: "age",
        type: "number"
    },
    {
        regex: /^(c?id)$/i,
        canonicalName: "ID",
        mappedName: "id",
        type: "unique id"
    },
    {
        regex: /^(country|location)$/i,
        canonicalName: "Country/Location",
        mappedName: "country",
        type: "string"
    },
    {
        regex: /^gender$/i,
        canonicalName: "Gender",
        mappedName: "gender",
        type: "gender"
    },
    {
        regex: /^((current\s*)?city)$/i,
        canonicalName: "Current City",
        mappedName: "currentCity",
        type: "string"
    },
]

export function parse(file, event) {
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            if (results.errors.length > 0) {
                event.displayErrors(results.errors)
            } else {
                const errors = collectCriticalErrors(results);
                if (errors.length > 0) {
                    event.displayErrors(errors)
                } else {
                    furtherParse(results.data, event)
                }
            }
        }
    })
}

export function generateFile() {
    const csv = Papa.unparse(store.getters.studentsForDownload)
    return new Blob([csv], { type: "text/csv;charset=utf-8" })
}

function collectCriticalErrors(results) {
    const errors = [];
    if (results.data.length <= 1) {
        errors.push("There are 1 or less students!");
    }
    if (emptyHeaderExists(results.meta.fields)) {
        errors.push("Column headers cannot be empty!");
    }
    if (duplicateHeaderExists(results.meta.fields)) {
        errors.push(`Cannot have duplicate header columns! (${duplicateHeaderColumns(results.meta.fields)})`)
    }
    return errors;
}

function emptyHeaderExists(headers) {
    return headers.some(h => h === "");
}

function duplicateHeaderExists(headers) {
    return new Set(headers).size !== headers.length;
}

function duplicateHeaderColumns(headers) {
    return headers.filter((h, index) => headers.indexOf(h) !== index);
}

function emptyFieldExists(data) {
    for (const person of data) {
        for (const attribute in person) {
            if (person[attribute] === "") {
                return true;
            }
        }
    }
    return false;
}

function findEmptyFields(data, warnings) {
    for (const [index, person] of data.entries()) {
        const emptyFields = [];
        for (const attribute in person) {
            if (person[attribute] === "") {
                emptyFields.push(attribute);
            }
        }
        if (emptyFields.length === 1) {
            warnings.push(`Field "${emptyFields[0]}" is empty for index ${index}`);
        } else if (emptyFields.length > 1) {
            warnings.push(`Fields ${emptyFields} are empty for index ${index}`);
        }
    }
}

function furtherParse(data, event) {
    let parsedStudents = data.map(() => new Object);
    let headers = []
    let warnings = []
    if (emptyFieldExists(data)) {
        findEmptyFields(data, warnings);
    }
    console.log(warnings);
    let attributes = Object.keys(data[0])
    for (const attribute of attributes) {
        if (!matchesCoreAttribute(attribute, data, parsedStudents, headers)) {
            handleUnknownAttribute(attribute, data, parsedStudents, headers);
        }
    }
    // eslint-disable-next-line no-console
    console.log(parsedStudents[0]);
    console.log(headers);
    for (const coreAttribute of coreAttributes) {
        if (!headers.some(h => h.value === coreAttribute.mappedName)) {
            warnings.push(`The core attribute ${coreAttribute.canonicalName} is missing or is not of type ${coreAttribute.type}!`)
        }
    }
    store.commit('setparsedStudents', parsedStudents);
    store.commit('setParsedHeaders', headers);
    store.commit('prepareFilters');
    if (warnings.length > 0) {
        event.displayWarnings(warnings, parsedStudents, headers);
    }
    event.finishParsing();
}

function matchesCoreAttribute(attribute, data, parsedStudents, headers) {
    for (const coreAttribute of coreAttributes) {
        if (coreAttribute.regex.test(attribute) && matchesRequiredType(attribute, data, coreAttribute.type)) {
            const uniqueValues = new Set();
            for (let i = 0; i < data.length; i++) {
                uniqueValues.add(data[i][attribute]);
                parsedStudents[i][coreAttribute.mappedName] = data[i][attribute];
            }
            headers.push({ text: attribute, value: coreAttribute.mappedName, type: coreAttribute.type, uniqueValues: Array.from(uniqueValues) })
            return true;
        }
    }
    return false;
}

function handleUnknownAttribute(attribute, data, parsedStudents, headers) {
    const type = inferUnknownType(attribute, data);
    const sanitizedName = getSanitizedName(attribute, headers);
    const uniqueValues = new Set();
    for (let i = 0; i < data.length; i++) {
        uniqueValues.add(data[i][attribute]);
        parsedStudents[i][sanitizedName] = data[i][attribute];
    }
    headers.push({ text: attribute, value: sanitizedName, type, uniqueValues: Array.from(uniqueValues) })
}

function getSanitizedName(attribute, headers) {
    let name = attribute.toLowerCase().replace(/\s/g, "_");
    if (!headers.some(h => h.value === name) && !restrictedKeyWords.includes(name)) {
        return name
    }
    let id = 0;
    do {
        name = name + id;
        id ++;
    } while (headers.some(h => h.value === name) || restrictedKeyWords.includes(name))
    return name;
}

function inferUnknownType(attribute, data) {
    const booly = /^(yes|no|true|false|1|0)$/i
    let isBooly = true;
    let isNumber = true;
    for (const student of data) {
        if (isBooly && student[attribute] && !booly.test(student[attribute])) {
            isBooly = false;
        }
        if (isNumber && student[attribute] && isNaN(student[attribute])) {
            isNumber = false;
        }
    }
    return isBooly ? "booly" : (isNumber ? "number" : "string");
}

function matchesRequiredType(attribute, data, type) {
    switch (type) {
        case "string":
            return true;
        case "number":
            for (const student of data) {
                if (student[attribute] && isNaN(student[attribute])) {
                    return false;
                }
            }
            return true;
        case "gender": {
            const valid = /^(male|female)$/i;
            for (const student of data) {
                if (student[attribute] && !valid.test(student[attribute])) {
                    return false;
                }
            }
            return true;
        }
        case "unique id": {
            const seen = new Set();
            for (const student of data) {
                if (student[attribute] && seen.has(student[attribute])) {
                    return false;
                }
                if (student[attribute]) {
                    seen.add(student[attribute])
                }
            }
            return true;
        }
        default:
            return false;
    }
}