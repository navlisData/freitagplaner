import {customRef, reactive, toRaw} from "vue";
import {tr} from "vuetify/locale";

const WEEKEND = '0 - Wochende';
const HOLIDAY = '1 - Feiertag';
const WORKINGDAY = '2 - Arbeitstag';

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

        const firstMonthInSelection = Math.min(...calculatorProfile.selectedMonthsProf)
        const correctedStartdate = correctDate(rawApiData,
            new Date(calculatorProfile.yearProf, firstMonthInSelection, 1, 0,0,0), false);
        console.log("Corrected Startdate: ", correctedStartdate)
        const lastMonthInSelection = Math.max(...calculatorProfile.selectedMonthsProf)

        const correctedEnddate = correctDate(rawApiData,
            new Date(calculatorProfile.yearProf, lastMonthInSelection, getLastDayOfMonth(calculatorProfile.yearProf, lastMonthInSelection), 0,0,0), true);
        console.log("Corrected Enddate: ", correctedEnddate)

        let dayArray = createDayArray(correctedStartdate, correctedEnddate, excludedJsonData);
        const splittedPeriods = splitIntoPeriods(dayArray);
        const weightedArray = calculatePeriodScore(splittedPeriods, true);
        console.log(weightedArray);
    },
};

function getLastDayOfMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getDayCount(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in milliseconds and convert to days
    return (end - start) / (1000 * 60 * 60 * 24);
}

//Checks on a specific date, if the next or previous days are non-working days > if so, adds them
function correctDate(rawJsonData, initDate, calculateForward) {
    let correctedDate = new Date(initDate);
    let dateToCheck = new Date(correctedDate);
    dateToCheck.setDate(correctedDate.getDate() + (calculateForward ? +1 : -1));

    while(dateToCheck.getDay() === 0 || dateToCheck.getDay() === 6 || matchesHoliday(rawJsonData, new Date(dateToCheck)) && (dateToCheck.getFullYear() === initDate.getFullYear())) {
        correctedDate = new Date(dateToCheck);
        dateToCheck.setDate(correctedDate.getDate() + (calculateForward ? +1 : -1));
    }
    return correctedDate;
}

function createDayArray(startDate, endDate, excludedJsonData) {
    let dayArray = [];
    // let startDate = new Date(year, 0, 1,0,0,0);

    for(let currDay = 0; currDay < getDayCount(startDate, endDate); currDay++) {
        let currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate()+currDay);

        let daytype = null;
        if(currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            daytype = WEEKEND;
        } else if(matchesHoliday(excludedJsonData, new Date(currentDate))) {
            daytype = HOLIDAY;
        } else {
            daytype = WORKINGDAY;
        }

        let dayEntry = {
            daytype: daytype,
            date: currentDate
        }

        dayArray.push(dayEntry);
    }
    return dayArray;
}

function splitIntoPeriods(dayEntries) {
    let periods = [];
    let currentPeriod = [];

    for (let i = 0; i < dayEntries.length; i++) {
        let entry = dayEntries[i];
        currentPeriod.push(entry);

        //Skipp 1st. Jan, otherwise the first period would be an array-entry with a single day ("Neujahrstag")
        if (i !== 0 && entry.daytype !== WORKINGDAY) {
            // AND it was the last dayEntry in the array
            // OR the next dayEntry exists and is a WORKINGDAY
            if(i === dayEntries.length - 1 || (dayEntries[i + 1] && dayEntries[i + 1].daytype === WORKINGDAY)) {
                if(periods.length>0) {
                    fillWithPreviousDays(periods, currentPeriod)
                }

                // save the currentPeriod and start a new one
                periods.push(currentPeriod);
                currentPeriod = [];
            }
        }
    }

    // add the last period, even if the last dayEntries-Array is a WORKINGDAY
    if (currentPeriod.length > 0) {
        if(periods.length>0) {
            fillWithPreviousDays(periods, currentPeriod)
        }
        periods.push(currentPeriod);
    }

    return periods;
}

function calculatePeriodScore(periodArray, ignoreUsualWeeks) {
    let weightedPeriods = [];

    for(let i = 0; i < periodArray.length; i++) {
        let workingdays = 0;
        let nonworkingdays = 0;
        for(let j = 0; j < periodArray[i].length; j++) {
            if(periodArray[i][j].daytype === WORKINGDAY) {
                workingdays++;
            } else {
                nonworkingdays++;
            }
        }

        //(if its a usual week of 5 workingdays and 4 nonworkingdays AND ignoreUsualWeeks is set) OR calculate for all weeks
        if(!(workingdays === 5 && nonworkingdays === 4) && ignoreUsualWeeks || (!ignoreUsualWeeks)) {
            let score = (nonworkingdays/workingdays);
            const weightedPeriod = {
                score: score,
                period: periodArray[i]
            }
            weightedPeriods.push(weightedPeriod);
        }
    }
    return weightedPeriods;
}

//add non-working days at end of the previous period to the start of the currentPeriod
function fillWithPreviousDays(periods, currentPeriod) {
    const prevPeriod = periods[periods.length-1];
    for(let i = prevPeriod.length; i > 0; i--) {
        const lastEntryInLastPeriod = prevPeriod[i-1];
        if(lastEntryInLastPeriod.daytype !== WORKINGDAY) {
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
