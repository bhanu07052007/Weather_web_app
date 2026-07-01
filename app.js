

const historyBtn = document.getElementById("historyBtn");
const historyPanel = document.getElementById("historyPanel");

const themeToggle = document.getElementById("themeToggle");

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const weatherTable = document.getElementById("weatherTable");
const tableBody = document.getElementById("tableBody");

const historyList = document.getElementById("historyList");



historyBtn.addEventListener("click", () => {
    historyPanel.classList.toggle("show");
});



themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");
});



searchBtn.addEventListener("click", searchWeather);

cityInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        searchWeather();

    }

});



function getWeather(code) {

    if (code === 0) return "Clear Sky ☀";

    if (code >= 1 && code <= 3) return "Cloudy ☁";

    if (code >= 45 && code <= 48) return "Fog 🌫";

    if (code >= 51 && code <= 67) return "Rain 🌧";

    if (code >= 71 && code <= 77) return "Snow ❄";

    if (code >= 80 && code <= 82) return "Rain Showers 🌦";

    if (code >= 95) return "Thunderstorm ⛈";

    return "Unknown";

}


async function searchWeather() {

    const city = cityInput.value.trim();

    if (city === "") {

        alert("Please enter a city.");

        return;

    }

    try {


        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results) {

            alert("City not found.");

            return;

        }

        const latitude = geoData.results[0].latitude;
        const longitude = geoData.results[0].longitude;
        const cityName = geoData.results[0].name;

        // Weather API

        const weatherResponse = await fetch(

            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`

        );

        const weatherData = await weatherResponse.json();

        weatherTable.style.display = "block";

        tableBody.innerHTML = `

            <tr>

                <td>${cityName}</td>

                <td>${weatherData.current.temperature_2m} °C</td>

                <td>${getWeather(weatherData.current.weather_code)}</td>

                <td>${weatherData.current.relative_humidity_2m}%</td>

                <td>${weatherData.current.wind_speed_10m} km/h</td>

            </tr>

        `;

        addHistory(cityName);

    }

    catch (error) {

        console.error(error);

        alert("Unable to fetch weather data.");

    }

}


function addHistory(city) {

    const cities = historyList.querySelectorAll("li");

    for (let item of cities) {

        if (item.textContent.toLowerCase() === city.toLowerCase()) {

            return;

        }

    }

    const li = document.createElement("li");

    li.textContent = city;

    li.style.cursor = "pointer";

    historyList.prepend(li);

    li.addEventListener("click", () => {

        cityInput.value = city;

        searchWeather();

    });

}