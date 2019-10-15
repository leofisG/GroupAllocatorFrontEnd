import Papa from 'papaparse'

var criticalList = ['cid', 'lastname', 'age', 
'firstname', 'country', 'city', 'cohort', 'region'];

export function parse(file) {
    Papa.parse(file, {
        header: true,
        complete: function(results) {
            furtuerParse(results.data)
        }
    })
}

function furtuerParse(data) {
    data.forEach(element => {
        var x
        var additionalAttributes = new Map();
        for (x in element) {
            if (!(criticalList.includes(x.toLocaleLowerCase()))) {
                additionalAttributes[x] = element[x];
                delete element[x]
            }
            element.additionalAttributes = additionalAttributes 
        }
    });
    // eslint-disable-next-line no-console
    console.log(data[0]);
    return data
}