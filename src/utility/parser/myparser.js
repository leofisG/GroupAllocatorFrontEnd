import Papa from 'papaparse'
import store from '../../store/store'

let coreAttributes = [
    {
        regex: /^first\s*name$/i,
        canonicalName: "First name",
        mappedName: "firstName",
        type: "string"
    },
    {
        regex: /^last\s*name$/i,
        canonicalName: "Lase name",
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
        canonicalName: "CID",
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
            } else if (results.data.length <= 1) {
                event.displayErrors(["There are 1 or less students!"])
            } else {
                furtherParse(results.data, event)
            }
        }
    })
}

export function generate(results) {
    const csv = Papa.unparse(results.students.sort((a, b) => a.groupId < b.groupId ? -1 : a.groupId > b.groupId ? 1 : 0))
    return new Blob([csv], { type: "text/csv;charset=utf-8" })
}

function emptyFieldExists(data) {
    for (const person of data) {
        for (const attribute in person) {
            if (person[attribute] === "") {
                console.log(attribute)
                console.log(person)
                return true;
            }
        }
    }

    return false;
}

function furtherParse(data, event) {
    let parsedStudents = data.map(() => new Object);
    let headers = []
    let warnings = []
    if (emptyFieldExists(data)) {
        warnings.push("One or more fields are empty!")
    }
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
            for (let i = 0; i < data.length; i++) {
                parsedStudents[i][coreAttribute.mappedName] = data[i][attribute]
            }
            headers.push({ text: attribute, value: coreAttribute.mappedName, type: coreAttribute.type })
            return true;
        }
    }
    return false;
}

function handleUnknownAttribute(attribute, data, parsedStudents, headers) {
    const type = inferUnknownType(attribute, data);
    console.log(`Type for ${attribute} is ${type}`);
    const sanitizedName = attribute.toLowerCase().replace(/\s/g, "_")
    for (let i = 0; i < data.length; i++) {
        parsedStudents[i][sanitizedName] = data[i][attribute]
    }
    headers.push({ text: attribute, value: sanitizedName, type })
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