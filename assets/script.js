var apiKey = "ef7310166a264ebe187d6c3c4405695e"; 
var apiUrl ="https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

// Function to fetch current weather data for a given city
function getWeatherData(cityName) { 
    // Prepare the URL for the API request, include the city name and your API key
    // Change metric to celsius
    var apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    // Use jQuery's ajax function to send a GET request to the API
    $.ajax({
        url: apiUrl,
        method: "GET" 
    }).then(function(response) {
        // When the response comes back, display the current weather
        displayCurrentWeather(response);
    });
}

// Function to fetch forecast weather data for a given city
function getForecastData(cityName) {
    var apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    $.ajax({
        url: apiUrl,
        method: "GET"
    });
}

// Function to display current weather data
function displayCurrentWeather(data) {
    // Find the elements in the HTML where we want to display data
    var temperatureElement = $(".weather__card h2");
    var cityNameElement = $(".weather__card h3");
    var dateElement = $(".weather__card h5");
    var descriptionElement = $(".weather__card .weather__description");

    // Get the data we want to display
    var temperature = `${Math.round(data.main.temp)}°`; // current temperature
    var cityName = data.name; // city name
    var date = new Date().toLocaleString(); // current date and time
    var description = data.weather[0].main; // weather description

    // Update the HTML elements with the new data
    temperatureElement.text(temperature);
    cityNameElement.text(cityName);
    dateElement.text(date);
    descriptionElement.text(description);

    // Repeat the same steps for humidity, sun-set time, and wind speed
    var humidityElement = $(".weather__status span").eq(0);
    var windSpeedElement = $(".weather__status span").eq(1);

    var humidity = `${data.main.humidity}%`;
    var windSpeed = `${data.wind.speed} km/h`;

    humidityElement.text(humidity); // Update the humidity
    windSpeedElement.text(windSpeed); // Update the wind speed

     // Update the date and time every second
     setInterval(function() {
        var date = new Date().toLocaleString(); // current date and time
        dateElement.text(date);
    }, 1000); // 1000 ms = 1 second
}

// fix the search button to work on press enter ???***

// Function to handle the click event on the search button
$("button").click(function() {
    // Get the city name from the input field
    var cityName = $("#search").val().trim(); // Get the city name from the input field, and trim the whitespace from the beginning and end

    // Fetch weather data for the city
    getWeatherData(cityName);
});