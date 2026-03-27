let cityInput = document.getElementById("city_input")
let searchBtn = document.getElementById("searchBtn")
let locationBtn = document.getElementById("locationBtn")

let api_key = "1f426d73361369c2d9f5cda44ac9b0eb"

let currentWeatherCard = document.querySelector(".current-weather")
let fiveDaysForecastCard = document.querySelector(".day-forecast")
let hourlyForecastCard = document.querySelector(".hourly-forecast")

let humidityVal = document.getElementById("humidityVal")
let pressureVal = document.getElementById("pressureVal")
let visibilityVal = document.getElementById("visibilityVal")
let windSpeedVal = document.getElementById("windSpeedVal")
let feelsVal = document.getElementById("feelsVal")

let sunriseVal = document.getElementById("sunriseVal")
let sunsetVal = document.getElementById("sunsetVal")
let aqiVal = document.getElementById("aqiVal")


function getWeatherDetails(name, lat, lon, country){

let WEATHER_API =
`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`

let FORECAST_API =
`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`

let AQI_API =
`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`


fetch(WEATHER_API)
.then(res=>res.json())
.then(data=>{

currentWeatherCard.innerHTML = `
<h2>${(data.main.temp-273.15).toFixed(1)}°C</h2>
<p>${data.weather[0].description}</p>
<p>${name}, ${country}</p>
<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
`

humidityVal.innerHTML = data.main.humidity+"%"
pressureVal.innerHTML = data.main.pressure+" hPa"
visibilityVal.innerHTML = (data.visibility/1000)+" km"
windSpeedVal.innerHTML = data.wind.speed+" m/s"
feelsVal.innerHTML = (data.main.feels_like-273.15).toFixed(1)+"°C"

let sunrise = new Date(data.sys.sunrise*1000)
let sunset = new Date(data.sys.sunset*1000)

sunriseVal.innerHTML = sunrise.toLocaleTimeString()
sunsetVal.innerHTML = sunset.toLocaleTimeString()

})


fetch(AQI_API)
.then(res=>res.json())
.then(data=>{

let aqi=data.list[0].main.aqi
let quality=["Good","Fair","Moderate","Poor","Very Poor"]

aqiVal.innerHTML=quality[aqi-1]

})


fetch(FORECAST_API)
.then(res=>res.json())
.then(data=>{

let hourlyForecast=data.list

hourlyForecastCard.innerHTML=""

for(let i=0;i<8;i++){

let time=new Date(hourlyForecast[i].dt_txt).getHours()

hourlyForecastCard.innerHTML+=`

<div class="card">

<p>${time}:00</p>

<img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png">

<p>${(hourlyForecast[i].main.temp-273.15).toFixed(1)}°C</p>

</div>

`

}

let uniqueDays=[]
let fiveDays=data.list.filter(item=>{

let date=item.dt_txt.split(" ")[0]

if(!uniqueDays.includes(date)){
uniqueDays.push(date)
return true
}

})

fiveDaysForecastCard.innerHTML=""

fiveDays.slice(1,6).forEach(day=>{

let date=new Date(day.dt_txt)

fiveDaysForecastCard.innerHTML+=`

<div class="forecast-item">

<img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">

<p>${date.toDateString()}</p>

<p>${(day.main.temp-273.15).toFixed(1)}°C</p>

</div>

`

})

})

}



function getCityCoordinates(){

let cityName=cityInput.value.trim()

if(cityName==="")return

let GEO_API=
`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`

fetch(GEO_API)
.then(res=>res.json())
.then(data=>{

let {name,lat,lon,country}=data[0]

getWeatherDetails(name,lat,lon,country)

})

}



function getUserCoordinates(){

navigator.geolocation.getCurrentPosition(position=>{

let lat=position.coords.latitude
let lon=position.coords.longitude

let REVERSE_API=
`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${api_key}`

fetch(REVERSE_API)
.then(res=>res.json())
.then(data=>{

let {name,country}=data[0]

getWeatherDetails(name,lat,lon,country)

})

})

}



searchBtn.addEventListener("click",getCityCoordinates)
locationBtn.addEventListener("click",getUserCoordinates)

cityInput.addEventListener("keyup",e=>{
if(e.key==="Enter")getCityCoordinates()
})

window.addEventListener("load",getUserCoordinates)