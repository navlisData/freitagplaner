export const dataFetch = {
    async fetchApi(year, state) {
        const apiUrl = 'http://localhost:8081/holidays?year=' + year + '&country=' + state;
        console.log("Api Url: ", apiUrl);
        try {
            const response = await fetch(apiUrl);
            if(response.ok) {
                return await response.json();
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (ex) {
            console.error('Error occurred while fetch operation: ', ex);
            throw ex;
        }
    },

    async createTokenResult(calculatorProfile) {
        const rawApiData = await this.fetchApi(calculatorProfile.yearProf, calculatorProfile.stateProf);
        const excludedJsonData = removeExcludedMonths(rawApiData, calculatorProfile.selectedMonthsProf);

        const output = [];
        const reward = 5;
        const weekdayDecrementer = 1;

        Object.keys(excludedJsonData).forEach(holidayName => {
            const holiday = excludedJsonData[holidayName];
            let startDate = new Date(holiday.datum);
            let endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + calculatorProfile.maxDaysProf);

            let tokenCount = 0;
            let weekendDate = [];
            let holidayDate = [];

            const result = {
                tokenCount,
                weekendDate,
                holidayDate
            }

            for (let i = new Date(startDate); i <= endDate; i.setDate(i.getDate() + 1)) {
                if(i.getDay() === 0 || i.getDay()===6) {
                    tokenCount+=reward;
                    weekendDate.push(new Date(i));
                } else if(matchesHoliday(excludedJsonData, new Date(i))) {
                    tokenCount+=reward;
                    holidayDate.push(new Date(i));
                } else {
                    tokenCount-=weekdayDecrementer;
                }
            }

            result.tokenCount = tokenCount;
            result.weekendDate = weekendDate;
            result.holidayDate = holidayDate;

            output.push(result);
        });

        return output;
    },
};

function matchesHoliday(jsonData, dateToCheck) {
    for (const holidayName of Object.keys(jsonData)) {
        const holiday = jsonData[holidayName];
        const holidayDate = new Date(holiday.datum);
        if (holidayDate.getTime() === dateToCheck.getTime()) {
            return true;
        }
    }
    return false;
}

function removeExcludedMonths(jsonData, monthArray) {
    let filteredHolidays = {};
    Object.keys(jsonData).forEach(holidayName => {
        const holiday = jsonData[holidayName];
        const month = new Date(holiday.datum).getMonth();
        if (monthArray.includes(month)) {
            filteredHolidays[holidayName] = holiday;
        }
    });
    return filteredHolidays;
}

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
