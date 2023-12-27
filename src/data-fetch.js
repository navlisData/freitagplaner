export const dataFetch = {
    async fetchApi(year, state) {
        const apiUrl = 'http://localhost:8081/holidays?year=' + year + '&country=' + state;
        // const apiUrl = 'https://feiertage-api.de/api/?jahr='+year+'&nur_land='+state;
        console.log("Api Url: ", apiUrl);
        fetch(apiUrl)
            .then(response => {
                if(response.ok) {
                    return response.json();
                }
                throw new Error('Network response failed');
            })
            .then(data => {
                console.log(data);
            })
            .catch(ex => {
                console.error('Error occured while fetch operation: ', ex);
            });
    }
};
