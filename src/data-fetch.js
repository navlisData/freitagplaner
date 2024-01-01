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
            startDate = new Date(correctDate(rawApiData, startDate, false));
            endDate = new Date(correctDate(rawApiData, endDate, true));
        }

        let dayArray = createDayArray(startDate, endDate, excludedJsonData);
        // console.log("Dayarray: ", dayArray)
        const splittedPeriods = splitIntoPeriods(dayArray);
        // console.log("SplittedPeriods: ", splittedPeriods)
        const preparedPeriods = preparePeriodScore(splittedPeriods, false);
        // console.log("Scored periods: ", preparedPeriods);

        let bestCombinations = [];
        for(let i = 0; i < preparedPeriods.length; i++) {
            const combinationsByIndex = findAllPeriodCombinations(preparedPeriods, i, calculatorProfile.minDaysProf, calculatorProfile.maxDaysProf);
            // console.log(combinationsByIndex);
            let bestScore = 0;
            let bestPeriod = []
            for(let j = 0; j < combinationsByIndex.length; j++) {

                const { totalWorkingDays, totalNonWorkingDays } = combinationsByIndex[j].reduce((acc, index) => {
                    return {
                        totalWorkingDays: acc.totalWorkingDays + preparedPeriods[index].workingdays,
                        totalNonWorkingDays: acc.totalNonWorkingDays + preparedPeriods[index].nonworkingdays
                    };
                }, { totalWorkingDays: 0, totalNonWorkingDays: 0 });

                let score = totalNonWorkingDays !== 0 ? totalNonWorkingDays / totalWorkingDays : 0;

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

        console.log("Sorting descending...");
        bestCombinations.sort((a, b) => b.score - a.score);
        console.log("Best scored periods are: ");
        for(let i = 0; i < bestCombinations.length; i++) {
            for(let j = 0; j < bestCombinations[i].bestScoredPeriod.length; j++) {
                console.log(preparedPeriods[bestCombinations[i].bestScoredPeriod[j]])
            }
        }
    },
};

function findAllPeriodCombinations(periods, startPeriodIndex, minDays, maxDays) {
    let allCombinations = [];

    function backtrack(combination, currentDayCount, index) {
        // Check if the period has already more days than given
        if (currentDayCount <= maxDays) {
            // save valid combination as soon min-days is reached
            if (currentDayCount >= minDays) {
                allCombinations.push(combination.slice());
            }

            // step one index back and forth
            [-1, 1].forEach(direction => {
                let nextIndex = index + direction;
                if (nextIndex >= 0 && nextIndex < periods.length && !combination.includes(nextIndex)) {
                    combination.push(nextIndex);
                    backtrack(combination, currentDayCount + cleanPeriodCount(index, nextIndex), nextIndex);
                    combination.pop(); // reset for the next iteration
                }
            });
        }
    }

    function cleanPeriodCount(currPeriodIndex, nextPeriodIndex) {
        return periods[nextPeriodIndex].period.filter(np => !periods[currPeriodIndex].period.includes(np)).length;
    }

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

function preparePeriodScore(periodArray, ignoreUsualWeeks) {
    let weightedPeriods = [];

    let scoredPeriod = {
        period: [],
        workingdays: 0,
        nonworkingdays: 0
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

        scoredPeriod.period = periodArray[i];
        scoredPeriod.workingdays = workingdays;
        scoredPeriod.nonworkingdays = nonworkingdays;
        weightedPeriods.push(scoredPeriod);

        scoredPeriod = {
            period: [],
            workingdays: 0,
            nonworkingdays: 0
        }

        //(if its a usual week of 5 workingdays and 4 nonworkingdays AND ignoreUsualWeeks is set) OR calculate for all weeks
        // if(!(workingdays === 5 && nonworkingdays === 4) && ignoreUsualWeeks || (!ignoreUsualWeeks)) {
        //
        // }
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
