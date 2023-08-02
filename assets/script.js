var apiKey = "ef7310166a264ebe187d6c3c4405695e";
var apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

$.getJSON('./assets/city.list.min.json', function (data) {
    availableCities = data.map(city => `${city.name}, ${city.country}`);
    $("#search").autocomplete({
        source: availableCities
    });
});

// Function to process the city search
function processCitySearch() {
    var city = $("#search").val().trim();
    if (availableCities.includes(city)) {
        getWeatherData(city);
        getForecastData(city);
    } else {
        alert("City not found. Please select a city from the list.");
    }
}
  
// Function to fetch current weather data for a given city
function getWeatherData(cityName) { 
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    $.ajax({
        url: apiUrl,
        method: "GET" 
    })
    .done(function(response) {
        console.log(response.weather);
        displayCurrentWeather(response);
    })
    .fail(function() {
        console.error("Error fetching weather data. Check if the city name is correct.");
    });
}

// Function to display current weather data

var timeInterval;

function displayCurrentWeather(data) {
    var countryCode = data.sys.country;
    var description = data.weather[0].main;
    var iconPath = `./assets/images/weather-icons-master/animation-ready/${description.toLowerCase()}.svg`;
    $("#wicon").attr("src", iconPath);
    
    // Update the HTML elements with the new data
    $("#temperature-display").text(`${Math.round(data.main.temp)}°`);
    $("#description-display").text(description);
    $("#city-display").text(`${data.name}, ${countryCode}`);
    $("#humidity-display").text(`${data.main.humidity}%`);
    $("#wind-display").text(`${data.wind.speed} km/h`);

    // Get the timezone offset from the data (in seconds)
    var timezoneOffset = data.timezone;

    // clear the existing interval
    if (timeInterval) {
        clearInterval(timeInterval);
    }

    // Update the date and time every second
    timeInterval = setInterval(function() {
        // Get the current date and time in UTC
        var now_utc = new Date();
        var utc_time_ms = now_utc.getTime() + now_utc.getTimezoneOffset() * 60 * 1000;

        // Calculate the local time in the city
        var localTime = new Date(utc_time_ms + timezoneOffset * 1000);

        // Update the date and time display
        $("#date-display").text(localTime.toLocaleDateString());
        $("#time-display").text(localTime.toLocaleTimeString());
    }, 1000); 
}

function getForecastData(cityName) {
    var apiKey = "ef7310166a264ebe187d6c3c4405695e";  
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${cityName}&appid=${apiKey}`;

    // Fetch the forecast data
    fetch(apiUrl)
        .then(function(response) {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(function(data) {
            displayForecast(data.list);  // pass the forecast data list to the displayForecast function
            console.log(data)
        })
        .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ', error.message);
        });
}
function displayForecast(data) {
    // Clear old forecast data
    $("#forecast-container").empty();

    // Define an array with the names of the days of the week
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Loop over the data and add a card for each day
    for (var i = 1; i < data.length; i += 8) { // "8" will display 5 cards for the forecast.
        // Get the date of the forecast
        var forecastDate = new Date(data[i].dt * 1000);

        // Get the day of the week
        var dayOfWeek = daysOfWeek[forecastDate.getDay()]; 
        var iconPath = `./assets/images/weather-icons-master/animation-ready/${data[i].weather[0].main.toLowerCase()}.svg`;
        var cardHtml = `
                        <div class="forecast-card">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h5 class="card-title">${dayOfWeek}</h5> <!-- Display the day of the week -->
                                    <img src="${iconPath}">
                                    <p class="card-text forecast-description">${data[i].weather[0].description}</p>
                                    <p class="card-text">${Math.round(data[i].main.temp)}°</p>
                                    <div class="d-flex justify-content-around">
                                        <p class="card-text">
                                            <img src='./assets/images/weather-icons-master/animation-ready/raindrops.svg' alt='Humidity Icon'>
                                            ${data[i].main.humidity}%
                                        </p>
                                        <p class="card-text">
                                            <img src='./assets/images/weather-icons-master/animation-ready/wind.svg' alt='Wind Icon'>
                                            ${data[i].wind.speed} km/h
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
        $("#forecast-container").append(cardHtml);
    }
}

// Button click event
$("button").click(function() {
    processCitySearch();
});

// Enter key event
$("#search").keypress(function(e) {
    if (e.which === 13) { // 13 is the key code for Enter key
        processCitySearch();
    }
});

$(document).ready(function () {
    // Set "Adelaide" as the default city
    getWeatherData("Adelaide");
    getForecastData("Adelaide");

    // Button click event for specific search button
    $("#search-button").click(function () {
        processCitySearch();
    });
});