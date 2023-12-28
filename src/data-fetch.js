import {customRef} from "vue";

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


        // Initialisieren Sie eine Map und rufen Sie die Funktion auf
        let dayMap = new Map();
        iterateThroughYear(calculatorProfile.yearProf, excludedJsonData, true, dayMap);
        iterateThroughYear(calculatorProfile.yearProf, excludedJsonData, false, dayMap);
        console.log(dayMap)

        const output = findMinValueInterval(calculatorProfile.minDaysProf, calculatorProfile.maxDaysProf);
        console.log(output);
    },

    // async createTokenResult(calculatorProfile) {
    //     const rawApiData = await this.fetchApi(calculatorProfile.yearProf, calculatorProfile.stateProf);
    //     const excludedJsonData = removeExcludedMonths(rawApiData, calculatorProfile.selectedMonthsProf);
    //
    //     const output = [];
    //     const reward = 5;
    //     const weekdayDecrementer = 1;
    //
    //     Object.keys(excludedJsonData).forEach(holidayName => {
    //         const holiday = excludedJsonData[holidayName];
    //         let startDate = new Date(holiday.datum);
    //         let endDate = new Date(startDate);
    //         endDate.setDate(startDate.getDate() + calculatorProfile.maxDaysProf);
    //
    //         let tokenCount = 0;
    //         let weekendDates = [];
    //         let holidayDates = [];
    //
    //         const result = {
    //             tokenCount,
    //             weekendDates,
    //             holidayDates
    //         }
    //
    //         for (let i = new Date(startDate); i <= endDate; i.setDate(i.getDate() + 1)) {
    //             if(i.getDay() === 0 || i.getDay()===6) {
    //                 tokenCount+=reward;
    //                 weekendDates.push(new Date(i));
    //             } else if(matchesHoliday(excludedJsonData, new Date(i))) {
    //                 tokenCount+=reward;
    //                 holidayDates.push(new Date(i));
    //             } else {
    //                 tokenCount-=weekdayDecrementer;
    //             }
    //         }
    //
    //         result.tokenCount = tokenCount;
    //         result.weekendDates = weekendDates;
    //         result.holidayDates = holidayDates;
    //
    //         output.push(result);
    //     });
    //
    //     return output;
    // },
};

function iterateThroughYear(year, excludedJsonData, directionForward, dayMap) {
    let currentDate = directionForward ? new Date(year, 0, 1) : new Date(year, 11, 31);
    console.log("Currentdate: ", currentDate)
    let score = 0;

    while (currentDate.getFullYear() === year) {

        console.log("fullYear: ", currentDate.getFullYear() + " and year: ", year)

        let weight = 0;
        let daytype = null;

        if(currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            daytype = 'WeekendDay';
            score = 0;
        } else if(matchesHoliday(excludedJsonData, new Date(currentDate))) {
            daytype = 'HolidayDay';
            score = 0;
        } else {
            score++;
            weight = score;
            daytype = 'Workingday';
        }

        let dateString = currentDate.toISOString().split('T')[0]; // Erstellt einen eindeutigen Schlüssel für das Datum
        console.log("Key: ",  currentDate.toISOString())

        if(!directionForward) {
            let existingDay = dayMap.get(dateString);
            if(existingDay) {
                weight += existingDay.weight; // Addieren Sie den weight Wert des ersten Durchlaufs
            }
        }

        let day = {
            weight: weight,
            daytype: daytype,
            date: new Date(currentDate) // oder einfach currentDate, wenn keine Modifikationen an currentDate vorgenommen werden
        };

        dayMap.set(dateString, day);

        // Datum aktualisieren
        if(directionForward) {
            currentDate.setDate(currentDate.getDate() + 1);
        } else {
            currentDate.setDate(currentDate.getDate() - 1);
        }
    }
}

function findMinValueInterval(data, minIntervalLength, maxIntervalLength) {
    let minSum = Infinity;
    let minPeriod = null;

    // Konvertiere die Daten in ein Array von [date, value] für leichtere Iteration
    let dataArray = Array.from(data);

    // Iteriere durch alle möglichen Intervalllängen
    for (let intervalLength = minIntervalLength; intervalLength <= maxIntervalLength; intervalLength++) {
        for (let i = 0; i <= dataArray.length - intervalLength; i++) {
            let sum = 0;
            let period = [];

            // Summiere Werte für den aktuellen Zeitraum
            for (let j = 0; j < intervalLength; j++) {
                sum += dataArray[i + j][1];
                period.push(dataArray[i + j][0]);
            }

            // Wenn aktuelle Summe kleiner als minSum, aktualisiere minSum und minPeriod
            if (sum < minSum) {
                minSum = sum;
                minPeriod = period;
            }
        }
    }

    return {
        minSum,
        minPeriod
    };
}


const DayType = {
    Workingday: '',
    HolidayDay: '',
    WeekendDay: '',
}

function matchesHoliday(jsonData, dateToCheck) {
    for (const holidayName of Object.keys(jsonData)) {
        const holiday = jsonData[holidayName];
        const holidayDate = new Date(holiday.datum);

        if (holidayDate.getDate() === dateToCheck.getDate() && (holidayDate.getMonth() === dateToCheck.getMonth())) {
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
