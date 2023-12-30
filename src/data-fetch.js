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

        let dayArray = [];
        iterateThroughYear(calculatorProfile.yearProf, excludedJsonData, true, dayArray);
        iterateThroughYear(calculatorProfile.yearProf, excludedJsonData, false, dayArray);
        console.log(dayArray)

        console.log(splitIntoPeriods(dayArray));
    },
};

function getDayCountByYear(year) {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    // Calculate the difference in milliseconds and convert to days
    return (end - start) / (1000 * 60 * 60 * 24);
}


function iterateThroughYear(year, excludedJsonData, directionForward, dayArray) {
    let startDate = directionForward ? new Date(year, 0, 1,0,0,0) : new Date(year, 11, 31,0,0,0);
    let score = 0;

    for(let currDay = 0; currDay < getDayCountByYear(year); currDay++) {
        let currentDate = new Date(startDate);
        currentDate.setDate(directionForward ? (currentDate.getDate()+currDay) : (currentDate.getDate()-currDay));

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

        if(!directionForward) {
            let existingDay = dayArray[dayArray.length - currDay -1];
            if(existingDay) {
                weight += existingDay.weight;
            } else {
                console.error("Existing day not found");
            }
        }

        let dayEntry = {
            daytype: daytype,
            date: currentDate,
            weight: weight
        }

        if(directionForward) {
            dayArray.push(dayEntry);
        } else {
            dayArray[dayArray.length - currDay -1] = dayEntry;
        }
    }
}

function splitIntoPeriods(dayEntries) {
    let periods = [];
    let currentPeriod = [];

    for (let i = 0; i < dayEntries.length; i++) {
        let entry = dayEntries[i];
        currentPeriod.push(entry);

        // Check if the current dayEntry has weight = 0
        // AND the next dayEntry exists and has weight != 0
        // OR it was the last dayEntry in the array
        if (entry.weight === 0 &&
            (i === dayEntries.length - 1 || (dayEntries[i + 1] && dayEntries[i + 1].weight !== 0))) {

            if(periods.length>0) {
                fillWithPreviousDays(periods, currentPeriod)
            }

            // save the currentPeriode and start a new one
            periods.push(currentPeriod);
            currentPeriod = [];
        }
    }

    // add the last period, even if the last dayEntries-Array doesn't end with a "weight = 0" entry
    if (currentPeriod.length > 0) {
        if(periods.length>0) {
            fillWithPreviousDays(periods, currentPeriod)
        }
        periods.push(currentPeriod);
    }

    return periods;
}

//add non-working days at end of the previous period to the start of the currentPeriod
function fillWithPreviousDays(periods, currentPeriod) {
    const prevPeriod = periods[periods.length-1];
    for(let i = prevPeriod.length; i > 0; i--) {
        const lastEntryInLastPeriod = prevPeriod[i-1];
        if(lastEntryInLastPeriod.weight === 0) {
            currentPeriod.unshift(lastEntryInLastPeriod);
        } else {
            return;
        }
    }
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
