var searchFormFormEl = document.querySelector("#search-form");
var cityNameEl = document.querySelector("#city-name");
var weatherTodayEl = document.querySelector("#weatherToday");
var searchHistory = document.querySelector("#search-history");

var apiKey = "17bdb0a9cef0e45b9ba087d5a89ddfab";

var searchWeatherForACity = function (event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  var cityName = cityNameEl.value.trim();
  cityNameEl.value = "";
  getWeatherForACity(cityName);
};

var clearData = function () {
  weatherTodayEl.innerHTML = "";
};

var addToSearchHistory = function (city) {
  var cityNameContainer = document.createElement("div");
  cityNameContainer.innerHTML = city;
  searchHistory.appendChild(cityNameContainer);
};

var displayUVIndexValue = function (latitude, longitude) {
  // format the github api url
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&appid=" +
    apiKey;

  console.log(apiUrl);
  // make a get request to url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response
          .json()
          .then(function (data) {
            var UVIndexContainer = document.createElement("div");
            UVIndexContainer.innerHTML = "UV Index: " + data.current.uvi;
            weatherTodayEl.appendChild(UVIndexContainer);
            console.log("TEST_data: ", data);
            var test = data.current.weather[0].icon;
            console.log("TEST: " + test);

            return data.current.weather[0].icon;
          })
          .then(function (icon) {
            var img = $("<img />", {
              src: "http://openweathermap.org/img/wn/" + icon + "@2x.png",
            });
            img.appendTo($("#cityName"));
          });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert(
        "Unable to get data about the weather. Something is wrong with a remote server"
      );
    });
};

var displayWeather = function (data, city) {
  // Today's date
  const today = dateFns.format(new Date(), "M/DD/YYYY");
  var cityNameContainer = document.createElement("div");
  cityNameContainer.innerHTML = "<h3>" + city + " (" + today + ")</h3> ";
  cityNameContainer.setAttribute("id", "cityName");

  var temperatureContainer = document.createElement("div");
  // Convert Kelvins degrees into Fahrenheit
  var temperatureFahrenheit = (
    ((data.main.temp - 273.15) * 9) / 5 +
    32
  ).toFixed(2);
  temperatureContainer.innerHTML = "Temp: " + temperatureFahrenheit + "&#176;F";
  var windSpeedContainer = document.createElement("div");
  windSpeedContainer.innerHTML = "Wind: " + data.wind.speed + " MPH";
  var humidityContainer = document.createElement("div");
  humidityContainer.innerHTML = "Humidity: " + data.main.humidity + " %";
  weatherTodayEl.appendChild(cityNameContainer);
  weatherTodayEl.appendChild(temperatureContainer);
  weatherTodayEl.appendChild(windSpeedContainer);
  weatherTodayEl.appendChild(humidityContainer);
  displayUVIndexValue(data.coord.lat, data.coord.lon);
};

var getWeatherForACity = function (city) {
  // format the github api url
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey;

  // make a get request to url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          clearData();
          displayWeather(data, city);
          addToSearchHistory(city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert(
        "Unable to get data about the weather. Something is wrong with a remote server"
      );
    });
};

searchFormFormEl.addEventListener("submit", searchWeatherForACity);
