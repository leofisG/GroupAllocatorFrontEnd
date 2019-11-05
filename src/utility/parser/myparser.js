import Papa from 'papaparse'
import store from '../../store/store'

var requiredAttributes = new Map([
    ["Age" , "30"],
    ["Gender", "Male"],
    ["Current City", "London"],
    ["Country" , "United Kingdom"]
])

var translationMap = new Map([
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
    const csv = Papa.unparse(results.students)
    return new Blob([csv], {type: "text/csv;charset=utf-8"})
}

function furtherParse(data, event) {
    var attributeList = Array.from(translationMap.keys());
    var res = []
    var headers = []
    data.forEach(element => {
        var newElement = {}
        var attribute
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
    store.commit('setParsedData', res);
    store.commit('setParsedHeaders', headers);
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