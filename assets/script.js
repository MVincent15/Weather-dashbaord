
var APIkey = "649629c11bc23683f8c08fdedb1644a4";

var citySearchForm =$("#city-search-form");

citySearchForm.on("submit", function(event) {
    event.preventDefault();
    
    var chosenCity = $("#input-value").val();

    todaysWeather(chosenCity);
    fiveDayForecast(chosenCity);
    
});

function todaysWeather(chosenCity) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + chosenCity + '&appid=' + APIkey )
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            var longitude = response.coord.lon;
            var latitiude = response.coord.lat;

            fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + latitiude + '&lon=' + longitude +'&appid=' + APIkey)
                .then(function(response) {
                    return response.json();
                })
                .then(function(response){
                    searchHistory(chosenCity);
                    var cityTitle = $("#city-title");

                    var currentDate = dayjs();
                    var formattedDate = currentDate.format('(MM/DD/YYYY)');
                    $('#todays-date').text(formattedDate);
                    cityTitle.text(chosenCity + formattedDate);
                
                    var currentWeatherIcon = $("#weather-icon");
                    currentWeatherIcon.addClass("weather-icon");
                    var currentIcon = response.weather[0].icon;
                    currentWeatherIcon.attr("src", 'https://openweathermap.org/img/wn/' + currentIcon + '@2x.png');

                    var temperature = $("#temp");
                    var fahrenheit = Math.floor((response.main.temp - 273.15) * (9/5) + 32);
                    temperature.text("Temperature: " + fahrenheit + " \u00B0F");

                    var windSpeed = $("#wind");
                    windSpeed.text("Wind: " + response.wind.speed + " MPH");

                    var humidity = $("#humidity");
                    humidity.text("Humidity: " + response.main.humidity + "%");
                });
        });
}; 

function fiveDayForecast(chosenCity) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + chosenCity + '&appid=' + APIkey ).then(function(response) {
            return response.json();
        })
        .then(function(response) {
            var longitude = response.coord.lon;
            var latitiude = response.coord.lat;
            
            fetch('https://api.openweathermap.org/data/3.0/onecall?lat=' + latitiude + '&lon=' + longitude + '&appid=' + APIkey).then(function(response) {
                    return response.json();
                })
                .then(function(response) {
                    var fiveDayTitle = $("#five-day-title");
                    fiveDayTitle.text("5-Day Forecast:")
                    for (var i = 1; i < 6; i++) {
                        var futureDay = $(".five-day-forecast");
                        futureDay.addClass("five-day-card");

                        var forecastDateJS = dayjs();
                        var formattedForecastDate = forecastDateJS.format('MM/DD/YYYY');
                        $("#forecast-date-" + i).text(formattedForecastDate);
                        

                        var forecastIcon = $("#forecast-icon-" + i);
                        var forecastIconCode = response.daily[i].weather[0].icon;
                        forecastIcon.attr("src", 'https://openweathermap.org/img/wn/' + forecastIconCode + '@2x.png');

                        var forecastTemp = $("#forecast-temp-" + i);
                        var fahrenheitTemp = Math.floor((response.daily[i].temp.day - 273.15) *(9/5) +32);
                        forecastTemp.text("Temp: " + fahrenheitTemp + " \u00B0F");

                        var forecastWind= $('#forecast-wind-' + i);
                        forecastWind.text("Wind: " + response.daily[i].wind_speed + " MPH");

                        var forecastHumidity = $("#forecast-humidity-" + i);
                        forecastHumidity.text("Humidity: " + response.daily[i].humidity + "%");
                        
                    }
                })
        })
};
var savedHistory = [];

function searchHistory(chosenCity) {
    var searchHistoryInput = $("<p>");
    var searchInput = $("<div>");
    var searchHistoryEl = $("#search-history");
    var inputValue = $("#input-value");

    searchHistoryInput.addClass("past-search-history");
    searchHistoryInput.text(chosenCity);
    $('.past-search-history:contains("' + chosenCity + '")');


    searchInput.addClass("past-search-history-container");
    searchInput.append(searchHistoryInput);

    searchHistoryEl.append(searchInput);
    inputValue.val("");

    savedHistory.push(chosenCity);
    localStorage.setItem("savedHistory", JSON.stringify(savedHistory));

    if (savedHistory.length > 0){
        var previousSearch = localStorage.getItem("savedHistory");
        savedHistory = JSON.parse(previousSearch);
    }

};

function showSearchHistory() {
    var savedSearchHistory = localStorage.getItem("savedHistory");
    savedSearchHistory = JSON.parse(savedSearchHistory);
    for (var i = 0; i < savedSearchHistory.length; i++) {
        searchHistory(savedSearchHistory[i]);
    }
};
showSearchHistory();


var searchHistorybtn = $("#search-history");

searchHistorybtn.on("click", "p", function() {
    var previousCitySearch = $(this).text();
    todaysWeather(previousCitySearch);
    fiveDayForecast(previousCitySearch);
});

