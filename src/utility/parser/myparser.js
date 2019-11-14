import Papa from 'papaparse'
import store from '../../store/store'

let requiredAttributes = new Map([
    ["Age" , "30"],
    ["Gender", "Male"],
    ["Current City", "London"],
    ["Country" , "United Kingdom"]
])

let translationMap = new Map([
    ["First name", "firstName"],
    ["Last name", "lastName"],
    ["Age", "age"],
    ["CID", "id"],
    ["Country", "country"],
    ["Gender", "gender"],
    ["DOB", "dob"],
    ["Current City", "currentCity"],
    ["Subject Area", "career"],
    ["Qualification Description", "degree"],
    ["Work exp. on application", "workYearNum"],
    ["Current Cohort", "cohort"]
])


export function parse(file, event) {
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            if (results.errors.length > 0) {
                event.displayErrors(results.errors.length)
            } else {
                furtherParse(results.data, event)
            }
        }
    })
}

export function generate(results) {
    const csv = Papa.unparse(results.students.sort((a, b) => a.groupId < b.groupId ? -1 : a.groupId > b.groupId ? 1 : 0))
    return new Blob([csv], {type: "text/csv;charset=utf-8"})
}

function furtherParse(data, event) {
    let attributeList = Array.from(translationMap.keys());
    let res = []
    let headers = []
    data.forEach(element => {
        let newElement = {}
        let attribute
        for (attribute in element) {
            if (attributeList.includes(attribute)) {
                if (requiredAttributes.has(attribute) && element[attribute] == "") {
                    newElement[translationMap.get(attribute)] = requiredAttributes.get(attribute)
                } else {
                    newElement[translationMap.get(attribute)] = element[attribute]
                }
                if (!headerExists(headers, attribute)) {
                    headers.push({ text: attribute, value: translationMap.get(attribute) })
                }
            }
        }
        res.push(newElement)
    });
    // eslint-disable-next-line no-console
    console.log(res[0]);
    store.commit('setparsedStudents', res);
    store.commit('setParsedHeaders', headers);
    store.commit('prepareFilters');
    event.$router.push({path: "display-students"})
}

function headerExists(headers, attribute) {
    for (const header of headers) {
        if (header.text == attribute) {
            return true
        }
    }
    return false
}