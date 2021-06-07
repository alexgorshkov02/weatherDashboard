var searchFormFormEl = document.querySelector("#search-form");
var cityNameEl = document.querySelector("#city-name");
var weatherTodayEl = document.querySelector("#weather-today");
var searchHistory = document.querySelector("#search-history");

var apiKey = "17bdb0a9cef0e45b9ba087d5a89ddfab";

// today's date
const today = moment(new Date()).format("M/DD/YYYY");

var searchWeatherForACity = function (event) {
  // prevent page from refreshing
  event.preventDefault();
  $("#weather-today").text("");
  $("#days5-forecast").text("");

  var addCityToHistory = false;

  if (event.type === "load") {
    var cityName = "San Diego";
  } else if (event.type === "submit") {
    // get value from input element
    var cityName = cityNameEl.value.trim();
    addCityToHistory = true;
  } else if (event.type === "click") {
    var cityName = event.target.innerHTML;
  } else {
    console.log("Error: Events");
  }
  getWeatherForACity(cityName, addCityToHistory);
};

var clearData = function () {
  cityNameEl.value = "";
  weatherTodayEl.innerHTML = "";
};

var addToSearchHistory = function (city) {
  var cityNameContainer = document.createElement("btn");
  cityNameContainer.setAttribute(
    "class",
    "btn btn-secondary btn-block search-history-city"
  );
  cityNameContainer.innerHTML = city;
  cityNameContainer.addEventListener("click", searchWeatherForACity);
  searchHistory.appendChild(cityNameContainer);
};

function getVUIndexColor(UVIndexValue) {
  if (0 <= UVIndexValue && UVIndexValue < 2) {
    return "lightGreen";
  } else if (2 <= UVIndexValue && UVIndexValue < 4) {
    return "yellow";
  } else if (4 <= UVIndexValue && UVIndexValue < 6) {
    return "orange";
  } else if (6 <= UVIndexValue && UVIndexValue < 8) {
    return "lightPink";
  } else if (8 <= UVIndexValue && UVIndexValue < 10) {
    return "red";
  } else {
    console.log("Error: UV Index is undefined");
  }
}

var displayUVIndexValue = function (latitude, longitude) {
  // format the github api url
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&appid=" +
    apiKey +
    "&units=imperial";

  // make a get request to url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response
          .json()
          .then(function (data) {
            var UVIndexContainer = document.createElement("div");
            var UVIndexSpan = document.createElement("span");
            // get "UV Index" value
            const { uvi } = data.current;
            UVIndexSpan.innerHTML = uvi;
            var color = getVUIndexColor(uvi);
            UVIndexSpan.style.backgroundColor = color;
            UVIndexSpan.setAttribute("id", "uv-index");
            UVIndexContainer.innerHTML = "UV Index: ";
            UVIndexContainer.append(UVIndexSpan);
            weatherTodayEl.appendChild(UVIndexContainer);

            return data;
          })
          .then(function (data) {
            var img = $("<img />", {
              src:
                "http://openweathermap.org/img/wn/" +
                data.current.weather[0].icon +
                "@2x.png",
            });
            img.appendTo($("#cityName"));

            return data;
          })
          .then(function (data) {
            $("#days5-forecast-name").text("5-Day Forecast:");
            var days5Forecast = document.getElementById("days5-forecast");
            for (var i = 1; i <= 5; i++) {
              var forecastContainer = document.createElement("div");
              forecastContainer.setAttribute("class", "col-2 forecast-form");
              var date = moment(today).add(i, "d").format("M/DD/YYYY");
              dayContainer = document.createElement("div");
              dayContainer.innerHTML = "<h5>" + date + "</h5>";
              forecastContainer.appendChild(dayContainer);
              imgContainer = document.createElement("div");
              imgEl = document.createElement("img");
              imgEl.src =
                "http://openweathermap.org/img/wn/" +
                data.daily[i].weather[0].icon +
                "@2x.png";
              imgContainer.appendChild(imgEl);
              forecastContainer.appendChild(imgContainer);
              tempContainer = document.createElement("div");
              tempContainer.innerHTML =
                "Temp: " + data.daily[i].temp.day + " &#176;F";
              forecastContainer.appendChild(tempContainer);
              windContainer = document.createElement("div");
              windContainer.innerHTML =
                "Wind: " + data.daily[i].wind_speed + " MPH";
              forecastContainer.appendChild(windContainer);
              humidityContainer = document.createElement("div");
              humidityContainer.innerHTML =
                "Humidity: " + data.daily[i].humidity + " %";
              forecastContainer.appendChild(humidityContainer);

              days5Forecast.appendChild(forecastContainer);
            }
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
  var cityNameContainer = document.createElement("div");
  cityNameContainer.innerHTML = "<h3>" + city + " (" + today + ")</h3> ";
  cityNameContainer.setAttribute("id", "cityName");

  var temperatureContainer = document.createElement("div");
  temperatureContainer.innerHTML = "Temp: " + data.main.temp + "&#176;F";
  var windSpeedContainer = document.createElement("div");
  windSpeedContainer.innerHTML = "Wind: " + data.wind.speed + " MPH";
  var humidityContainer = document.createElement("div");
  humidityContainer.innerHTML = "Humidity: " + data.main.humidity + " %";
  weatherTodayEl.appendChild(cityNameContainer);
  weatherTodayEl.appendChild(temperatureContainer);
  weatherTodayEl.appendChild(windSpeedContainer);
  weatherTodayEl.appendChild(humidityContainer);
  weatherTodayEl.style = "border: solid 1px";
  displayUVIndexValue(data.coord.lat, data.coord.lon);
};

var getWeatherForACity = function (city, cityIsInHistory) {
  // format the github api url
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey +
    "&units=imperial";

  // make a get request to url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          clearData();
          displayWeather(data, city);
          if (cityIsInHistory) {
            addToSearchHistory(city);
          }
        });
      } else {
        alert(
          "The city has not been found. Please make sure the city name is correct"
        );
      }
    })
    .catch(function (error) {
      alert(
        "Unable to get data about the weather. Something is wrong with a remote server"
      );
    });
};

window.addEventListener("load", searchWeatherForACity);

searchFormFormEl.addEventListener("submit", searchWeatherForACity);
