// Node.js backend

// Use the express module for the server
const express = require('express');
const server = express();
const port = 8081;

// Use axios for API requests
const axios = require('axios');

// Require cors module
const cors = require('cors');

// Enable All CORS Requests for development, or configure as needed
server.use(cors());


/* 
Get the data from the holidays api
Parameters: year - the year; country - the country code e.g. BW, BY, ...
*/
async function getHolidayData(year=2024, country="BW"){

    if(year < 2020 || year > 2040) {
        return "Error; invalid year";
    }

    if(country != "NATIONAL" && country.length != 2) {
        return "Error; invalid country code";
    }

    // Make API call as a promise
    const promise = axios.get(`https://feiertage-api.de/api/?jahr=${year}&nur_land=${country}`);
    const dataPromise = promise.then((result) => result.data );
    return dataPromise;
}


// Set the default page 
server.get('/', (req, res)=> {

    // Send html file as a "landing page"
    res.sendFile('index.html', {root: __dirname});
});

// Set the holidays page
server.get('/holidays', (req, res) => {
    
    // Read the URL params
    let year = req.query.year;          
    let country = req.query.country;    

    // Wait for the end of getHolidayFunction before sending response
    getHolidayData(year, country).then(data => {
        res.send(data);
    });
})

// Set the server to listen on the configured port
server.listen(port, ()=> {
    console.log(`Server listening on port ${port}`);
});

