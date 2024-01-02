import {en} from "vuetify/locale";

const WEEKEND = 'Wochenende';
const HOLIDAY = 'Feiertag';
const WORKINGDAY = 'Arbeitstag';

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

    async getOptimizedPeriods(calculatorProfile) {
        const rawApiData = await this.fetchApi(calculatorProfile.yearProf, calculatorProfile.stateProf);
        const excludedJsonData = removeExcludedMonths(rawApiData, //reduce json data but substract and add one month for correcting dates
            (calculatorProfile.startMonthProf === 0 ? 0 : calculatorProfile.startMonthProf-1),
            (calculatorProfile.endMonthProf === 11 ? 11 : calculatorProfile.endMonthProf+1));

        let startDate = new Date(calculatorProfile.yearProf, calculatorProfile.startMonthProf, 1, 0,0,0);
        let endDate = new Date(calculatorProfile.yearProf, calculatorProfile.endMonthProf, getLastDayOfMonth(calculatorProfile.yearProf, calculatorProfile.endMonthProf), 0,0,0);

        console.log(calculatorProfile.correctDatesProf);
        if(calculatorProfile.correctDatesProf) {
            startDate = new Date(correctDate(excludedJsonData, startDate, false));
            endDate = new Date(correctDate(excludedJsonData, endDate, true));
        }

        let dayArray = createDayArray(startDate, endDate, excludedJsonData);
        const splittedPeriods = splitIntoPeriods(dayArray);
        const preparedPeriods = preparePeriodScore(splittedPeriods, false);
        let optimizedCombinations = optimizeCombinations(preparedPeriods, calculatorProfile.minDaysProf, calculatorProfile.maxDaysProf);
        console.log(optimizedCombinations);

        console.log("Removing combinations. Now: ", optimizedCombinations.length + " items.")
        optimizedCombinations = filterByStandardDeviation(optimizedCombinations);
        console.log("After removing: ", optimizedCombinations.length + " items.")

        optimizedCombinations.sort((a, b) => b.score - a.score);

        console.log("Best scored periods are: ");
        return concatPeriods(optimizedCombinations, preparedPeriods);
    },
};

//Due merging multiple periods, some days are duplicated and are needed to removed
function concatPeriods(optimizedCombinations, preparedPeriods) {
    let combinedPeriods = []

    for(let i = 0; i < optimizedCombinations.length; i++) { //for all combinations
        const periodPieces = optimizedCombinations[i].bestScoredPeriodPieces; //which can consist of several periods
        let periodBuilder = []
        for(let j = 0; j < periodPieces.length; j++) { //for each period-piece
            const periodEntity = preparedPeriods[periodPieces[j]].period;
            if(j === 0) {
                if(periodPieces === 1) {
                    const periodMetadata = {
                        period: periodBuilder, score: optimizedCombinations[i].score,
                        nonworkingdays: optimizedCombinations[i].nonworkingdays, workingdays: optimizedCombinations[i].workingdays
                    }
                    combinedPeriods.push(periodMetadata)
                } else {
                    periodBuilder = periodBuilder.concat(periodEntity)
                }
            } else {
                let periodCopy = periodEntity.slice();
                let index = 0;
                while(periodEntity[index] && periodEntity[index].daytype !== WORKINGDAY) {
                    periodCopy.shift();
                    index++;
                }
                periodBuilder = periodBuilder.concat(periodCopy);
            }
        }
        if (periodBuilder.length > 0) {
            const periodMetadata = {
                period: periodBuilder, score: optimizedCombinations[i].score,
                nonworkingdays: optimizedCombinations[i].nonworkingdays, workingdays: optimizedCombinations[i].workingdays
            }
            combinedPeriods.push(periodMetadata);
            periodBuilder = [];
        }
    }

    return combinedPeriods;
}

function optimizeCombinations(preparedPeriods, minDays, maxDays) {

    function optimizeAndScorePeriods() {
        let bestCombinations = [];
        for(let i = 0; i < preparedPeriods.length; i++) {
            const combinationsByIndex = cleanOutCombinations(findAllPeriodCombinations(preparedPeriods, i, minDays, maxDays));
            let bestScore = 0;
            let bestPeriod = []
            let workingdays = 0;
            let nonworkingdays = 0;
            for(let j = 0; j < combinationsByIndex.length; j++) {
                if(addedByOtherPeriod(combinationsByIndex[j])) continue;
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
                    workingdays = totalWorkingDays;
                    nonworkingdays = totalNonWorkingDays;
                }
            }
            const bestCombination = {
                bestScoredPeriodPieces: bestPeriod,
                workingdays: workingdays,
                nonworkingdays: nonworkingdays,
                score: bestScore
            }
            bestCombinations.push(bestCombination)
        }
        return bestCombinations;
    }

    let alreadySeen = new Set();
    function addedByOtherPeriod(combinationByIndex) {
        const sizeBefore = alreadySeen.size;
        alreadySeen.add(JSON.stringify(combinationByIndex));
        return alreadySeen.size === sizeBefore;
    }

    //Combinations may be built in various order, although they combine the same period-time
    function cleanOutCombinations(combinationsByIndex) {
        let uniqueSet = new Set();
        combinationsByIndex.forEach(arr => {
            let sortedArr = arr.sort((a, b) => a - b);
            uniqueSet.add(JSON.stringify(sortedArr));
        });
        return Array.from(uniqueSet).map(str => JSON.parse(str));
    }

    return optimizeAndScorePeriods();
}

function calculateScoreMedian(bestCombinations) {
    const scores = bestCombinations.map(bestCombination => bestCombination.score);
    scores.sort((a, b) => a - b);

    let median;
    const mid = Math.floor(scores.length / 2);
    if (scores.length % 2 === 0) {
        median = (scores[mid - 1] + scores[mid]) / 2;
    } else {
        median = scores[mid];
    }
    return median;
}

//with help of CGPT
function filterByStandardDeviation(bestCombinations) {
    // Extract scores from the best combinations
    const scores = bestCombinations.map(bestCombination => bestCombination.score);
    const mean = scores.reduce((acc, val) => acc + val, 0) / scores.length; //calc average of score
    const stdDev = Math.sqrt( //clac standard deviation (stdDev) of score
        scores.map(score => Math.pow(score - mean, 2)).reduce((acc, val) => acc + val, 0) / scores.length
    );
    const threshold = mean - 0.5 * stdDev;
    return bestCombinations.filter(bestCombination => bestCombination.score > threshold);
}

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

//Checks on a specific date, if the next or previous days are non-working days > if so, add them
function correctDate(rawJsonData, initDate, calculateForward) {
    let correctedDate = new Date(initDate);
    let dateToCheck = new Date(correctedDate);
    dateToCheck.setDate(correctedDate.getDate() + (calculateForward ? +1 : -1));

    while((dateToCheck.getDay() === 0 || dateToCheck.getDay() === 6 || getMatchingHolidayname(rawJsonData, new Date(dateToCheck))) && (dateToCheck.getFullYear() === initDate.getFullYear())) {
        correctedDate = new Date(dateToCheck);
        dateToCheck.setDate(correctedDate.getDate() + (calculateForward ? +1 : -1));
    }
    return correctedDate;
}

function createDayArray(startDate, endDate, excludedJsonData) {
    function createArray() {
        let dayArray = [];
        const dayCount = getDayCount(startDate, endDate);

        for(let currDay = 0; currDay < dayCount; currDay++) {
            let currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate()+currDay);

            let daytype = null;
            const holidayMatch = getMatchingHolidayname(excludedJsonData, new Date(currentDate));
            if(holidayMatch) {
                daytype = HOLIDAY;
            } else if(currentDate.getDay() === 0 || currentDate.getDay() === 6) {
                daytype = WEEKEND;
            } else {
                daytype = WORKINGDAY;
            }

            let dayEntry = {
                daytype: daytype,
                date: currentDate,
                holidayname: holidayMatch
            }

            dayArray.push(dayEntry);
        }
        return dayArray;
    }

    function getDayCount(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Calculate the difference in milliseconds and convert to days
        let dayCount = (end - start) / (1000 * 60 * 60 * 24);
        return dayCount+1; //include the end date as a full day
    }

    return createArray();
}

function splitIntoPeriods(dayEntries) {
    function createSplittedPeriods() {
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

    return createSplittedPeriods();
}

function preparePeriodScore(periodArray, ignoreUsualWeeks) {
    let preparedPeriods = [];

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
        preparedPeriods.push(scoredPeriod);

        scoredPeriod = {
            period: [],
            workingdays: 0,
            nonworkingdays: 0
        }
    }
    return preparedPeriods;
}

function getMatchingHolidayname(jsonData, dateToCheck) {
    for (const holidayName of Object.keys(jsonData)) {
        const holiday = jsonData[holidayName];
        const holidayDate = new Date(holiday.datum);

        if (holidayDate.getDate() === dateToCheck.getDate() && (holidayDate.getMonth() === dateToCheck.getMonth())) {
            return holidayName;
        }
    }
    return null;
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