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

var displayWeather = function (data, city) {
  var cityNameContainer = document.createElement("div");
  cityNameContainer.innerHTML = city;
  weatherTodayEl.appendChild(cityNameContainer);
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
