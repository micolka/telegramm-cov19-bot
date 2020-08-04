function getWeatherData(weatherData) {
  return  `
Weather in ${weatherData.location.name} is:
Temperature: ${weatherData.current.temperature} °C
Feels like: ${weatherData.current.feelslike} °C
Description: ${weatherData.current.weather_descriptions}
Wind speed: ${weatherData.current.wind_speed} km/h
Humidity: ${weatherData.current.humidity} %
`;
}

function getCovidData(data) {
  return `
Country: ${data[0][0].country}
Cases: ${data[0][0].cases}
Deaths: ${data[0][0].deaths}
Recovered: ${data[0][0].recovered}
`;
}

exports.getWeatherData = getWeatherData;
exports.getCovidData = getCovidData;