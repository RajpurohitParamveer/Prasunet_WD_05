document.getElementById('fetchWeatherBtn').addEventListener('click', fetchWeather);

async function fetchWeather() {
    const location = document.getElementById('locationInput').value;
    if (location) {
        console.log(`Fetching weather for location: ${location}`);
        getWeatherByLocation(location);
    } else {
        if (navigator.geolocation) {
            console.log('Attempting to get geolocation');
            navigator.geolocation.getCurrentPosition(getWeatherByCoords, showError);
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }
}

async function getWeatherByLocation(location) {
    const apiKey = '0b90924174054406a0f202632240507'; // Your WeatherAPI.com API key
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;

    try {
        console.log('API URL:', apiUrl); // Log API URL for debugging
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch weather for ${location}. Status: ${response.status}`);
        }

        const weatherData = await response.json();
        console.log('Weather data:', weatherData); // Log weather data for debugging
        displayWeather(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert(error.message); // Display error message to the user
    }
}

async function getWeatherByCoords(position) {
    const apiKey = '0b90924174054406a0f202632240507'; // Your WeatherAPI.com API key
    const { latitude, longitude } = position.coords;
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`;

    try {
        console.log(`Fetching weather for coordinates: ${latitude}, ${longitude}`);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather for current location');
        }

        const weatherData = await response.json();
        console.log('Weather data:', weatherData); // Log weather data for debugging
        displayWeather(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert(error.message); // Display error message to the user
    }
}

function displayWeather(data) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    weatherDisplay.innerHTML = `
        <div class="weatherInfo">Location: ${data.location.name}, ${data.location.country}</div>
        <div class="weatherInfo">Temperature: ${data.current.temp_c} °C</div>
        <div class="weatherInfo">Weather: ${data.current.condition.text}</div>
        <div class="weatherInfo">Humidity: ${data.current.humidity} %</div>
        <div class="weatherInfo">Wind Speed: ${data.current.wind_kph} km/h</div>
    `;

    // Change background image or class based on weather condition
    const weatherCondition = data.current.condition.text.toLowerCase();
    changeBackground(weatherCondition);
}

function changeBackground(weatherCondition) {
    const body = document.body;

    // Reset previous background image
    body.style.backgroundImage = 'none';

    // Set background image based on weather condition
    switch (weatherCondition) {
        case 'clear':
            body.style.backgroundImage = `url('images/clear.png')`; // Path to clear weather image
            break;
        case 'cloudy':
        case 'overcast':
            body.style.backgroundImage = `url('images/cloudy.png')`; // Path to cloudy weather image
            break;
        case 'rain':
        case 'light rain':
        case 'moderate rain':
        case 'heavy rain':
            body.style.backgroundImage = `url('images/rainy.png')`; // Path to rainy weather image
            break;
        case 'snow':
            body.style.backgroundImage = `url('images/snowy.png')`; // Path to snowy weather image
            break;
        case 'storm':
        case 'thunderstorm':
            body.style.backgroundImage = `url('images/stormy.png')`; // Path to stormy weather image
            break;
        default:
            body.style.backgroundImage = 'none'; // No background image if condition doesn't match
            break;
    }
}


function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert('User denied the request for Geolocation.');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable.');
            break;
        case error.TIMEOUT:
            alert('The request to get user location timed out.');
            break;
        case error.UNKNOWN_ERROR:
            alert('An unknown error occurred.');
            break;
    }
}
