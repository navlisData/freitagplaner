export const dataFetch = {
    async fetchApi(year, state) {
        const apiUrl = 'http://localhost:8081/holidays?year=' + year + '&country=' + state;
        console.log("Api Url: ", apiUrl);
        try {
            const response = await fetch(apiUrl);
            if(response.ok) {
                const data = await response.json();
                // logJson(data);
                return data; 
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (ex) {
            console.error('Error occurred while fetch operation: ', ex);
            throw ex;
        }
    },

    removeExcludedMonths(jsonData, monthArray) {
        let filteredHolidays = {};
        Object.keys(jsonData).forEach(holidayName => {
            const holiday = jsonData[holidayName];
            const month = new Date(holiday.datum).getMonth();
            if (monthArray.includes(month)) {
                filteredHolidays[holidayName] = holiday;
            }
        });
        return filteredHolidays;
    },
};



function logJson(jsonData) {
    // Iterate over each key in the object
    Object.keys(jsonData).forEach(holidayName => {
        const holiday = jsonData[holidayName];
        console.log("HolidayName: " + holidayName);
        console.log("Datum: " + holiday.datum);
        if(holiday.hinweis !== "") {
            console.log("Hinweis: " + holiday.hinweis);
        }
    });
}
