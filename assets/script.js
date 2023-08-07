var apiKey = "ef7310166a264ebe187d6c3c4405695e"; // API Key
var apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q="; // API URL

function getWeatherData(cityName) { // Function to get weather data for a city
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    $.ajax({ 
        url: apiUrl, 
        method: "GET" // use GET method
    })
    .done(function(response) {
        // Call the displayCurrentWeather function with the fetched data
        displayCurrentWeather(response);
    });
}

$.getJSON('./assets/city.list.min.json', function (data) { // Get the list of cities from JSON, downloaded bulk city list from openweathermaps
    availableCities = data.map(city => `${city.name}, ${city.country}`);
    $("#search").autocomplete({
        source: availableCities
    });
});

// Initialize searchHistory array from localStorage or as an empty array
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Function to process the city search
function processCitySearch() {
    var city = $("#search").val().trim();
    if (availableCities.includes(city)) {
        // Add the city to the searchHistory array
        searchHistory.unshift(city);
        // Limit the search history to 5 entries
        if (searchHistory.length > 5) searchHistory.pop();
        // Save the updated searchHistory array to localStorage
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        // Fetch and display weather data for the city
        getWeatherData(city);
        getForecastData(city);
        console.log("Fetching weather and forecast data here....")
        // Update the display of search history cards
        displaySearchHistoryCards();
    } else {
        alert("City not found. Please select a city from the list.");
    }
}

// Function to display search history cards
function displaySearchHistoryCards() {
    // Clear the existing search history cards
    $("#search-history-cards").empty();
    // Iterate through the searchHistory array and create cards for each city
    searchHistory.forEach(function (city, index) {
        // Create a card element for the city
        var card = $('<div class="card search-history-card">').text(city);

        // Create a button element for removing the card
        var removeButton = $('<button class="remove-button">').text('x');
        removeButton.click(function(event) {
            // Stop the event from bubbling up to the card
            event.stopPropagation();
            // Remove the card from the display
            $(this).parent().remove();
            // Remove the city from the searchHistory array
            searchHistory.splice(index, 1);
            // Save the updated searchHistory array to localStorage
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        });

        // Append the button to the card
        card.prepend(removeButton);
        
        // Append the card to the designated container in the HTML
        $("#search-history-cards").append(card);
    });
}

// Function to display current weather data
var timeInterval;

function displayCurrentWeather(data) { // Function to display current weather data
    var countryCode = data.sys.country; // Get the country code
    var description = data.weather[0].main; // Get the weather description
    var iconPath = `./assets/images/weather-icons-master/animation-ready/${description.toLowerCase()}.svg`;
    $("#wicon").attr("src", iconPath); // Set the weather icon, dynamically changes according to weather description
    
    // Update the HTML elements with the new data
    $("#temperature-display").text(`${Math.round(data.main.temp)}°`); // Update the temperature
    $("#description-display").text(description); // Update the weather description
    $("#city-display").text(`${data.name}, ${countryCode}`); // Update the city
    $("#humidity-display").text(`${data.main.humidity}%`); // Update the humidity
    $("#wind-display").text(`${data.wind.speed} km/h`); // Update the wind

    // Get the timezone offset from the data (in seconds)
    var timezoneOffset = data.timezone; 

    // clear the existing interval
    if (timeInterval) {
        clearInterval(timeInterval);
    }

    // Update the date and time every second
    timeInterval = setInterval(function() {
        // Get the current date and time in UTC
        var now_utc = new Date(); // Get the UTC time
        var utc_time_ms = now_utc.getTime() + now_utc.getTimezoneOffset() * 60 * 1000; // Get the UTC time

        // Calculate the local time in the city
        var localTime = new Date(utc_time_ms + timezoneOffset * 1000); // Get the local time

        // Update the date and time display
        $("#date-display").text(localTime.toLocaleDateString()); // Update the date
        $("#time-display").text(localTime.toLocaleTimeString()); // Update the time
    }, 1000); 
}

function getForecastData(cityName) { // Function to get forecast data
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

// Click event for search history cards
$(document).on("click", ".card", function () {
    // Get the city name from the card text, excluding the remove button's text
    var city = $(this).clone()    // clone the element
                       .children() // select all the children
                       .remove()   // remove all the children
                       .end()  // go back to the selected element
                       .text();    // get the text of element
    // Fetch and display weather data for the clicked city
    getWeatherData(city);
    getForecastData(city);
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
