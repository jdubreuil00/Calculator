let lat;
let lon;


function getLocation() {
    const forecastData = document.getElementById("Forecast");
    function success(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        const locationDisplay = document.getElementById("loc");
        const locationDiv = document.getElementById("loc-div");
        locationDisplay.innerHTML = `Your location Latitude:${lat} and Longitude:${lon}`;
        locationDiv.classList.add("loc-anim");
        locationDiv.addEventListener("animationend",()=>{
            locationDiv.classList.remove("loc-anim")
        })

        getOffice(position.coords.latitude, position.coords.longitude)
    }

    function error() {
        forecastData.innerHTML = "<br>Unable to get location. Check your browser settings.";
        console.log("Unable to get location. Check your browser settings.");
    }

    if (!navigator.geolocation) {
        forecastData.innerHTML = "<br>Geolocation is not supported by your browser.";
        console.log("Geolocation is not supported by your browser");
    } else {

        forecastData.innerHTML = "<br>Getting Weather Please Wait...";
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

function dropLocation(event) {
    event.preventDefault();
    var city = document.getElementById('city').value;
    let result;
    if (city == "New York") {
        result = makeResult("OKX", 33, 35, city, "NY");
    } else if (city == "Boston") {
        result = makeResult("BOX", 71, 90, city, "MA");
    } else if (city == "Orlando") {
        result = makeResult("MLB", 26, 68, city, "FL");
    } else if (city == "Chicago") {
        result = makeResult("LOT", 76, 73, city, "IL");
    } else if (city == "Washington") {
        result = makeResult("LWX", 96, 72, city, "DC");
    } else if (city == "Atlanta") {
        result = makeResult("FFC", 51, 87, city, "GA");
    } else if (city == "Seattle") {
        result = makeResult("SEW", 125, 68, city, "WA");
    } else if (city == "San Francisco") {
        result = makeResult("MTR", 85, 105, city, "CA");
    } else if (city == "Los Angeles") {
        result = makeResult("LOX", 155, 45, city, "CA");
    }
    const locationDisplay = document.getElementById("loc");
    locationDisplay.innerHTML = ``;

    getForecast(result)
}

function makeResult(office, gridX, gridY, city, state) {
    return {
        gridX: gridX,
        gridY: gridY,
        office: office,
        city: city,
        state: state
    }
}

async function getOffice(lat, lon) {
    try {
        let officeUrl = `https://api.weather.gov/points/${lat},${lon}`;

        let response = await fetch(officeUrl);
        let data = await response.json()

        console.log(data);
        console.log(data.properties);
        let result = {
            gridX: data.properties.gridX,
            gridY: data.properties.gridY,
            office: data.properties.cwa,
            city: data.properties.relativeLocation.properties.city,
            state: data.properties.relativeLocation.properties.state
        }
        console.log(result)
        getForecast(result)
        //return result
    }
    catch (error) {
        console.error('Error fetching data:', error);
        const forecastData = document.getElementById("Forecast");
        forecastData.innerHTML = "";
        let errorMsg = document.createElement("p");
        errorMsg.innerHTML = `Error getting weather data: ${error}`;
        forecastData.appendChild(errorMsg);
    }
}

async function getForecast(location) {
    try {
        let forecasturl = `https://api.weather.gov/gridpoints/${location.office}/${location.gridX},${location.gridY}/forecast`
        let response = await fetch(forecasturl);
        let data = await response.json();
        console.log(data)
        const forecastData = document.getElementById("Forecast");
        let weatherHeader = document.createElement("h2");
        weatherHeader.innerHTML = `Weather Forecast for ${data.properties.periods[0].name} in ${location.city}, ${location.state}`;
        let forecast = document.createElement("p");
        forecast.innerHTML = data.properties.periods[0].detailedForecast;
        let temeratureF = document.createElement("p");
        let temeratureC = Math.round((Number(data.properties.periods[0].temperature) - 32) * 5 / 9);
        temeratureF.innerHTML = `Temperature: ${data.properties.periods[0].temperature} F / ${temeratureC} C`;
        let humidity = document.createElement("p");
        humidity.innerHTML = `Humidity: ${data.properties.periods[0].relativeHumidity.value}%`;
        let windspeed = document.createElement("p");
        windspeed.innerHTML = `Wind Speed: ${data.properties.periods[0].windSpeed} m/s ${data.properties.periods[0].windDirection}`;
        let icon = document.createElement('img');
        icon.src = data.properties.periods[0].icon;

        
        forecastData.innerHTML = "";
        forecastData.appendChild(weatherHeader);
        forecastData.appendChild(icon);
        forecastData.appendChild(forecast);
        forecastData.appendChild(temeratureF);
        forecastData.appendChild(humidity);
        forecastData.appendChild(windspeed);
        forecastData.classList.add("weather-anim")
        forecastData.addEventListener("animationend",()=>{
            forecastData.classList.remove("weather-anim")
        })

        console.log(data.properties.periods[0].detailedForecast)
    }
    catch (error) {
        console.error('Error fetching data:', error);
        const forecastData = document.getElementById("Forecast");
        forecastData.innerHTML = "";
        let errorMsg = document.createElement("p");
        errorMsg.innerHTML = `Error getting weather data: ${error}`;
        forecastData.appendChild(errorMsg);
        forecastData.classList.add("weather-anim")
        forecastData.addEventListener("animationend",()=>{
            forecastData.classList.remove("weather-anim")
        })
        

    }

}
document.querySelector("h1").style.animation = "wipe 5s";

document.getElementById("localWeather").addEventListener("click", getLocation);
document.getElementById("weather-form").addEventListener("submit", dropLocation)
