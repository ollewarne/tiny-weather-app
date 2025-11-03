const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm (slight or moderate)",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
};

const input = document.querySelector("#search");
const output = document.querySelector("#output-box");

let citySearched = "";
let cityFound = "";

input.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        if (input.value.trim() === "") return;
        getCoordinatesByCity(input.value.trim())
            .then(result => {
                cityFound = result.results[0].name
                getCurrentWeather(result.results[0].latitude, result.results[0].longitude)
                    .then(temperatureData => {
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
        citySearched = input.value.trim()
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
