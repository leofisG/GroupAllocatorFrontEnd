import Papa from 'papaparse'


var translationMap = new Map([
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

function furtherParse(data, event) {
    var attributeList = Array.from(translationMap.keys());
    var res = []
    data.forEach(element => {
        var newElement = {}
        var attribute
        for (attribute in element) {
            if (attributeList.includes(attribute)) {
                newElement[translationMap.get(attribute)] = element[attribute]
            }
        }
        res.push(newElement)
    });
    // eslint-disable-next-line no-console
    console.log(res[0]);
    event.$emit('parsed', res)
}