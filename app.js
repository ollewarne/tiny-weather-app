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

input.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        if (input.value.trim() === "") return;
        getCoordinates(input.value.trim());
        citySearched = input.value.trim()
        input.value = "";
    }
})

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
