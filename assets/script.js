var apiKey = "ef7310166a264ebe187d6c3c4405695e"; 
var apiUrl ="https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

// Function to fetch current weather data for a given city
function getWeatherData(cityName) { 
    var apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    $.ajax({
        url: apiUrl,
        method: "GET" 
    }).then(function(response) {
        console.log(response.weather);
        displayCurrentWeather(response);
    });
}

// Function to display current weather data
function displayCurrentWeather(data) {
    var description = data.weather[0].main;
    var iconPath = `./assets/images/weather-icons-master/animation-ready/${description.toLowerCase()}.svg`;
    $("#wicon").attr("src", iconPath);
    
    // Update the HTML elements with the new data
    $("#temperature-display").text(`${Math.round(data.main.temp)}°`);
    $("#city-display").text(data.name);
    $("#description-display").text(description);
    $("#humidity-display").text(`${data.main.humidity}%`);
    $("#wind-display").text(`${data.wind.speed} km/h`);

    // Update the date and time every second
    setInterval(function() {
        $("#date-display").text(getCurrentDay());
        $("#time-display").text(getCurrentTime());
    }, 1000); 
}

// Function to get current time
function getCurrentTime() {
    return new Date().toLocaleTimeString();
}

// Function to get current day
function getCurrentDay() {
    return new Date().toLocaleDateString();
}
// Functionaility for keypress on "enter" search
$("#search").keypress(function(e) {
    if (e.which == 13) {  // 13 is the code for the Enter key
        $("button").click();
    }
});

// Function to handle the click event on the search button
$("button").click(function() {
    getWeatherData($("#search").val().trim());
});
