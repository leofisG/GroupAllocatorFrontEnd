import store from '../store/store'

const sendRequest = display => {
    const filters = store.state.filters;
    const requestData = {
        filters: filters,
        students: store.state.parsedStudents
    };
    const xml = new XMLHttpRequest();
    xml.open(
        "POST",
        store.state.URL,
        true
    );
    xml.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xml.onreadystatechange = () => {
        if (xml.readyState == 4) {
            if (xml.status == 200) {
                const response = JSON.parse(xml.responseText);
                display.allocationMessage = display.generateResultMessage(response);
                store.commit('storeResults', response);
            } else {
                // eslint-disable-next-line
                console.log(xml.status);
                // eslint-disable-next-line
                if (xml.responseText) {
                    const error = JSON.parse(xml.responseText);
                    console.log(error);
                    display.error = error;
                } else {
                    display.error = {
                        status: "Unknown",
                        message: "Request timed out"
                    }
                }
                display.resultDialog = false;
                display.errorDialog = true;
            }
        }
    };
    // eslint-disable-next-line
    console.log(filters);
    xml.send(JSON.stringify(requestData));
}

export default sendRequest