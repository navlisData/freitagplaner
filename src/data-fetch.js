export const dataFetch = {
    async fetchApi(year, state) {
        const apiUrl = 'http://localhost:8081/holidays?year=' + year + '&country=' + state;
        console.log("Api Url: ", apiUrl);
        fetch(apiUrl)
            .then(response => {
                if(response.ok) {
                    return response.json();
                }
                throw new Error('Network response failed');
            })
            .then(data => {
                logJson(data)
                console.log(data);
            })
            .catch(ex => {
                console.error('Error occured while fetch operation: ', ex);
            });
    }
};



function logJson(jsonData) {
    // Iterate over each key in the object
    Object.keys(jsonData).forEach(holidayName => {
        const holiday = jsonData[holidayName];
        console.log("HolidayName: " + holidayName);
        console.log("Datum: " + holiday.datum);
        if(holiday.hinweis != "") {
            console.log("Hinweis: " + holiday.hinweis);
        }
    });
}