import store from '../store/store'
import { merge, cloneDeep } from "lodash";

export const sendRequest = display => {
    const requestData = store.getters.requestData;
    // eslint-disable-next-line
    console.log("Sending to URL " + store.getters.rightURL)
    console.log(requestData)
    const xml = new XMLHttpRequest();
    xml.open(
        "POST",
        store.getters.rightURL,
        true
    );
    xml.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xml.onreadystatechange = () => {
        if (xml.readyState == 4) {
            if (xml.status == 200) {
                const response = JSON.parse(xml.responseText);
                store.commit('setAllocationMessage', response);
                store.commit('setRequestStatus');
                store.commit('storeUnparsedResults', response);
                console.log(response.students[0])
            } else {
                // eslint-disable-next-line
                console.log(xml.status);
                // eslint-disable-next-line
                if (xml.responseText) {
                    const error = JSON.parse(xml.responseText);
                    console.log(error);
                    store.commit("setRequestError", error);
                } else {
                    store.commit("setRequestError", {
                        status: "Unknown",
                        message: "Request timed out"
                    })
                }
                display.resultDialog = false;
                display.errorDialog = true;
            }
        }
    };
    // eslint-disable-next-line
    console.log(requestData.filters);
    xml.send(JSON.stringify(requestData));
}

export const generateResultMessage = response => {
    let message = `${response.numOfGroup} groups allocated`;
    if (response.numOfUnalloc == 1) {
        message += ", 1 student could not be allocated";
    } else if (response.numOfUnalloc > 1) {
        message += `, ${response.numOfUnalloc} students could not be allocated`;
    }
    message += ".";
    return message;
}

export const combineResults = () => {
    const results = store.state.unparsedResults.students;
    const students = cloneDeep(store.state.parsedStudents);
    const map = {};
    for (const student of results) {
        map[student.id] = {
            groupId: student.groupId,
            timezone: student.timezone,
            timezoneOffset:
                student.timezone > 0
                    ? "+" + student.timezone.toString()
                    : student.timezone.toString()
        };
    }
    for (const student of students) {
        merge(student, map[student.id]);
    }
    store.commit("commitParsedResults", students);
}