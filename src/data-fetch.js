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
        const excludedJsonData = removeExcludedMonths(rawApiData, //reduce json data but substract and add one month for correcting dates
            (calculatorProfile.startMonthProf === 0 ? 0 : calculatorProfile.startMonthProf-1),
            (calculatorProfile.startMonthProf === 11 ? 11 : calculatorProfile.startMonthProf+1));

        let startDate = new Date(calculatorProfile.yearProf, calculatorProfile.startMonthProf, 1, 0,0,0);
        let endDate = new Date(calculatorProfile.yearProf, calculatorProfile.endMonthProf, getLastDayOfMonth(calculatorProfile.yearProf, calculatorProfile.endMonthProf), 0,0,0);

        console.log(calculatorProfile.correctDatesProf);
        if(calculatorProfile.correctDatesProf) {
            console.log("Start org: ", startDate);
            startDate = new Date(correctDate(rawApiData, startDate, false));
            console.log("Start corr: ", startDate);
            endDate = new Date(correctDate(rawApiData, endDate, true));
        }

        let dayArray = createDayArray(startDate, endDate, excludedJsonData);
        // console.log("Dayarray: ", dayArray)
        const splittedPeriods = splitIntoPeriods(dayArray);
        console.log("SplittedPeriods: ", splittedPeriods)
        const scoredPeriods = calculatePeriodScore(splittedPeriods, false);
        console.log("Scored periods: ", scoredPeriods);

        let bestCombinations = [];
        for(let i = 0; i < scoredPeriods.length; i++) {
            const combinationsByIndex = findAllPeriodCombinations(scoredPeriods, i, calculatorProfile.minDaysProf, calculatorProfile.maxDaysProf);

            let bestScore = 0;
            let bestPeriod = []
            for(let j = 0; j < combinationsByIndex.length; j++) {
                const score = combinationsByIndex[j].reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                if(score > bestScore) {
                    bestScore = score;
                    bestPeriod = combinationsByIndex[j];
                }
            }
            const holder = {
                bestScoredPeriod: bestPeriod,
                score: bestScore
            }
            bestCombinations.push(holder)
        }

        console.log("bc: ", bestCombinations)
        console.log("Best scored periods are: ");
        for(let i = 0; i < bestCombinations.length; i++) {
            console.log("Combined Score is: ", bestCombinations[i].score);
            for(let j = 0; j < bestCombinations[i].bestScoredPeriod.length; j++) {
                console.log(scoredPeriods[bestCombinations[i].bestScoredPeriod[j]])
            }
        }
    },
};

function findAllPeriodCombinations(periods, startPeriodIndex, minDays, maxDays) {
    let allCombinations = [];

    function backtrack(combination, currentDayCount, index) {
        // Prüfen, ob die Passagieranzahl das Limit überschreitet
        if (currentDayCount <= maxDays) {
            // Speichere die gültige Kombination, wenn das Minimum erreicht wurde
            if (currentDayCount >= minDays) {
                allCombinations.push(combination.slice());
            }

            // Gehe zu den nächsten Waggons in beiden Richtungen
            [-1, 1].forEach(direction => {
                let nextIndex = index + direction;
                if (nextIndex >= 0 && nextIndex < periods.length && !combination.includes(nextIndex)) {
                    combination.push(nextIndex);
                    backtrack(combination, currentDayCount + cleanPeriodCount(index, nextIndex), nextIndex);
                    combination.pop(); // Zurücksetzen für den nächsten Durchlauf
                }
            });
        }
    }

    function cleanPeriodCount(currPeriodIndex, nextPeriodIndex) {
        return periods[nextPeriodIndex].period.filter(np => !periods[currPeriodIndex].period.includes(np)).length;
    }

    // Starte den Backtracking-Vorgang
    backtrack([startPeriodIndex], periods[startPeriodIndex].period.length, startPeriodIndex);

    return allCombinations;
}

function getLastDayOfMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getDayCount(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in milliseconds and convert to days
    let dayCount = (end - start) / (1000 * 60 * 60 * 24);
    return dayCount+1; //include the end date as a full day
}

//Checks on a specific date, if the next or previous days are non-working days > if so, adds them
function correctDate(rawJsonData, initDate, calculateForward) {
    let correctedDate = new Date(initDate);
    let dateToCheck = new Date(correctedDate);
    dateToCheck.setDate(correctedDate.getDate() + (calculateForward ? +1 : -1));

    while((dateToCheck.getDay() === 0 || dateToCheck.getDay() === 6 || matchesHoliday(rawJsonData, new Date(dateToCheck))) && (dateToCheck.getFullYear() === initDate.getFullYear())) {
        correctedDate = new Date(dateToCheck);
        dateToCheck.setDate(correctedDate.getDate() + (calculateForward ? +1 : -1));
    }
    return correctedDate;
}

function createDayArray(startDate, endDate, excludedJsonData) {
    let dayArray = [];
    const dayCount = getDayCount(startDate, endDate);

    for(let currDay = 0; currDay < dayCount; currDay++) {
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
    let alreadyFoundWorkingday = false; //For the case, that dayEntries starts with a non-working day
    let periods = [];

    let currentPeriod = [];

    for (let i = 0; i < dayEntries.length; i++) {
        let entry = dayEntries[i];
        currentPeriod.push(entry);

        if (entry.daytype !== WORKINGDAY) {
            // AND it was the last dayEntry in the array OR the next dayEntry exists and is a WORKINGDAY
            // and a workingday was already found
            if(i === dayEntries.length - 1 || (dayEntries[i + 1] && dayEntries[i + 1].daytype === WORKINGDAY) && alreadyFoundWorkingday === true) {
                if(periods.length>0) {
                    fillWithPreviousDays(periods, currentPeriod)
                }

                // save the currentPeriod and start a new one by resetting currentPeriod
                periods.push(currentPeriod);
                currentPeriod = [];
            }
        } else {
            alreadyFoundWorkingday = true;
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

    let scoredPeriod = {
        period: [],
        score: 0
    }

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
            scoredPeriod.period = periodArray[i];
            scoredPeriod.score = (nonworkingdays/workingdays);
            weightedPeriods.push(scoredPeriod);
            scoredPeriod = {
                period: [],
                score: 0
            }
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

function removeExcludedMonths(jsonData, startMonth, endMonth) {
    let filteredHolidays = {};
    Object.keys(jsonData).forEach(holidayName => {
        const holiday = jsonData[holidayName];
        const month = new Date(holiday.datum).getMonth();
        if (startMonth <= month && endMonth >= month) {
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
