var apiKey = "ef7310166a264ebe187d6c3c4405695e"; 
var apiUrl ="https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

// Fetch the JSON file (replace the URL with the actual path to the file)
$.getJSON('./assets/city.list.min.json', function(data) {
    // Create an array of strings for the autocomplete suggestions
    var availableCities = data.map(city => `${city.name}, ${city.country}`);

    // Initialize the autocomplete functionality
    $("#search").autocomplete({
        source: availableCities
    });
});

$(document).ready(function() {

// When the form is submitted...
$("#search-form").on("submit", function(event) {
    event.preventDefault();

    // Get the city name from the input field
    var cityName = $("#search").val(); // Change the id to "search"

    // Save the city name to localStorage and add it to the search history list
    saveCity(cityName);

    // Fetch and display the weather data and forecast for the city
    getWeatherData(cityName);
    getForecastData(cityName);
});

// Load the search history when the page loads
var cities = getSavedCities();
cities.forEach(function(cityName) {
    // Create a new list item for the city
    var li = $("<li></li>").text(cityName);
    li.addClass("search-item");  // add a class for styling and event handling

    // Append the list item to the search history list
    $("#search-history").append(li);
});

// Add event listener for clicks on the search history list
$("#search-history").on("click", ".search-item", function() {
    var cityName = $(this).text();

    // Fetch and display the weather data and forecast for cityName
    getWeatherData(cityName);
    getForecastData(cityName);
});

});

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
// Declare a variable for interval outside the function
var timeInterval;

function displayCurrentWeather(data) {
    var countryCode = data.sys.country;
    var description = data.weather[0].main;
    var iconPath = `./assets/images/weather-icons-master/animation-ready/${description.toLowerCase()}.svg`;
    $("#wicon").attr("src", iconPath);
    
    // Update the HTML elements with the new data
    $("#temperature-display").text(`${Math.round(data.main.temp)}°`);
    $("#city-display").text(data.name);
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

$(document).ready(function() {
    // Set "Adelaide" as the default city
    getWeatherData("Adelaide");
    getForecastData("Adelaide");

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
});;

function processCitySearch() {
    var city = $("#search").val().trim();
    if (city !== "" && availableCities.includes(city)) { // check if city is in the availableCities array
        getWeatherData(city);
        getForecastData(city); // add this line
    } else {
        alert("Please enter a valid city from the available cities.");
    }
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
            console.log(data.length)
        })
        .then(function(data) {
            displayForecast(data.list);  // pass the forecast data list to the displayForecast function
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
    for (var i = 8; i < data.length; i += 7) {
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