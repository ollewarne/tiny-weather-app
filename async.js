async function getCoordinates(city) {
    let coordinateUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&language=en&format=json`

    try {
        let response = await fetch(coordinateUrl);
        if (!response.ok) throw Error(response.status);
        let data = await response.json();
        if (!data.results) output.textContent = "city not found"
        getCurrentTemperature(data.results[0].latitude, data.results[0].longitude)
    } catch(error) {
        console.log(error);
    }
}

async function getCurrentTemperature(lat, long){
    let temperatureUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,weather_code`

    try {
        let response = await fetch(temperatureUrl);
        if (!response.ok) throw Error(response.status);
        let data = await response.json();
        output.textContent = `The current temperature in ${citySearched} is ${data.current.temperature_2m}°C and it's ${weatherCodes[data.current.weather_code]}`
    } catch(error) {
        console.log(error)
    }
}
