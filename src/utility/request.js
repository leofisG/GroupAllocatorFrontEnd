import store from '../store/store'

const sendRequest = display => {
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
                display.allocationMessage = display.generateResultMessage(response);
                store.commit('storeResults', response);
                console.log(response.students[0])
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
    console.log(requestData.filters);
    xml.send(JSON.stringify(requestData));
}

export default sendRequest