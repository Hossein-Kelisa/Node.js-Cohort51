import express from 'express';
import keys from './sources/keys.js';
import fetch from 'node-fetch';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from backend to frontend!');
});

app.post('/weather', async (req, res) => {
    try {
        const { cityName } = req.body;

        if (!cityName) {
            return res.status(400).json({ weatherText: 'City name is required!' });
        }

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${keys.API_KEY}`
        );

        if (!response.ok) {
            return res.status(404).json({ weatherText: 'City is not found!' });
        }

        const data = await response.json();
        const temperatureInCelsius = Math.floor(data.main.temp - 273.15);

        res.status(200).json({
            weatherText: `${cityName}: ${temperatureInCelsius}°C`
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export { app };