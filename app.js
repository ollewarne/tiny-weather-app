import { weatherCodes } from './weatherCodes.js'
const input = document.querySelector("#search");

input.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        if (input.value.trim() === "") return;
        getCoordinatesByCity(input.value.trim())
            .then(result => {
                let cityFound = result.results[0].name
                getCurrentWeather(result.results[0].latitude, result.results[0].longitude)
                    .then(temperatureData => {
                        const output = document.querySelector("#output-box");
                        output.textContent = 
                            `The current temperature in ${cityFound} is ${temperatureData.current.temperature_2m}°C and it's ${weatherCodes[temperatureData.current.weather_code]}`
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err);
            })
        input.value = "";
    }
})

function getCoordinatesByCity(city) {
    return new Promise((resolve, reject) => {
        let coordinatesUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&language=en&format=json`
        fetch(coordinatesUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function getCurrentWeather(lat, lon) {
    return new Promise((resolve, reject) => {
        let temperatureUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
        fetch(temperatureUrl)
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error. status: ${response.status}`);
                }
                return response.json()
            })
            .then(data => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            });
    });
}
