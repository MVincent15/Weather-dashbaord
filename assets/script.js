
var APIkey = "649629c11bc23683f8c08fdedb1644a4";

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