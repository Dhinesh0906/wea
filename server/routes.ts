import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check route for UptimeRobot
  app.get("/ping", (req, res) => {
    res.status(200).send("OK");
  });

  // Weather API routes
  app.get("/api/weather", async (req, res) => {
    try {
      const { lat, lon, city } = req.query;
      
      if (lat && lon) {
        const weather = await getWeatherByCoords(Number(lat), Number(lon));
        res.json(weather);
      } else if (city) {
        const weather = await getWeatherByCity(String(city));
        res.json(weather);
      } else {
        res.status(400).json({ error: "Missing required parameters" });
      }
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  app.get("/api/forecast/hourly", async (req, res) => {
    try {
      const { lat, lon, city } = req.query;
      
      if (lat && lon) {
        const forecast = await getHourlyForecast(Number(lat), Number(lon));
        res.json(forecast);
      } else if (city) {
        const forecast = await getHourlyForecastByCity(String(city));
        res.json(forecast);
      } else {
        res.status(400).json({ error: "Missing required parameters" });
      }
    } catch (error) {
      console.error("Hourly forecast API error:", error);
      res.status(500).json({ error: "Failed to fetch hourly forecast" });
    }
  });

  app.get("/api/forecast/daily", async (req, res) => {
    try {
      const { lat, lon, city } = req.query;
      
      if (lat && lon) {
        const forecast = await getDailyForecast(Number(lat), Number(lon));
        res.json(forecast);
      } else if (city) {
        const forecast = await getDailyForecastByCity(String(city));
        res.json(forecast);
      } else {
        res.status(400).json({ error: "Missing required parameters" });
      }
    } catch (error) {
      console.error("Daily forecast API error:", error);
      res.status(500).json({ error: "Failed to fetch daily forecast" });
    }
  });

  app.get("/api/search/cities", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        res.status(400).json({ error: "Missing search query" });
        return;
      }
      
      const cities = await searchCities(String(q));
      res.json(cities);
    } catch (error) {
      console.error("City search API error:", error);
      res.status(500).json({ error: "Failed to search cities" });
    }
  });

  app.get("/api/astronomy", async (req, res) => {
    try {
      const { lat, lon, city } = req.query;
      
      if (lat && lon) {
        const astronomy = await getAstronomyData(Number(lat), Number(lon));
        res.json(astronomy);
      } else if (city) {
        const astronomy = await getAstronomyDataByCity(String(city));
        res.json(astronomy);
      } else {
        res.status(400).json({ error: "Missing required parameters" });
      }
    } catch (error) {
      console.error("Astronomy API error:", error);
      res.status(500).json({ error: "Failed to fetch astronomy data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Weather API functions - These will need a weather API key to work properly
async function getWeatherByCoords(lat: number, lon: number) {
  const API_KEY = process.env.WEATHER_API_KEY;
  if (!API_KEY) {
    throw new Error("Weather API key not configured");
  }
  
  const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=yes`
  );
  
  if (!response.ok) {
    throw new Error("Weather API request failed");
  }
  
  const data = await response.json();
  return transformWeatherData(data);
}

async function getWeatherByCity(city: string) {
  const API_KEY = process.env.WEATHER_API_KEY;
  if (!API_KEY) {
    throw new Error("Weather API key not configured");
  }
  
  const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=yes`
  );
  
  if (!response.ok) {
    throw new Error("Weather API request failed");
  }
  
  const data = await response.json();
  return transformWeatherData(data);
}

async function getHourlyForecast(lat: number, lon: number) {
  const API_KEY = process.env.WEATHER_API_KEY;
  if (!API_KEY) {
    throw new Error("Weather API key not configured");
  }
  
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&hours=24`
  );
  
  if (!response.ok) {
    throw new Error("Weather API request failed");
  }
  
  const data = await response.json();
  return transformHourlyForecast(data.forecast.forecastday[0].hour);
}

async function getHourlyForecastByCity(city: string) {
  const API_KEY = process.env.WEATHER_API_KEY;
  if (!API_KEY) {
    throw new Error("Weather API key not configured");
  }
  
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&hours=24`
  );
  
  if (!response.ok) {
    throw new Error("Weather API request failed");
  }
  
  const data = await response.json();
  return transformHourlyForecast(data.forecast.forecastday[0].hour);
}

async function getDailyForecast(lat: number, lon: number) {
  const API_KEY = process.env.WEATHER_API_KEY;
  if (!API_KEY) {
    throw new Error("Weather API key not configured");
  }
  
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7`
  );
  
  if (!response.ok) {
    throw new Error("Weather API request failed");
  }
  
  const data = await response.json();
  return transformDailyForecast(data.forecast.forecastday);
}

async function getDailyForecastByCity(city: string) {
  const API_KEY = process.env.WEATHER_API_KEY;
  if (!API_KEY) {
    throw new Error("Weather API key not configured");
  }
  
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7`
  );
  
  if (!response.ok) {
    throw new Error("Weather API request failed");
  }
  
  const data = await response.json();
  return transformDailyForecast(data.forecast.forecastday);
}

async function searchCities(query: string) {
  const API_KEY = process.env.WEATHER_API_KEY;
  if (!API_KEY) {
    throw new Error("Weather API key not configured");
  }
  
  const response = await fetch(
    `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`
  );
  
  if (!response.ok) {
    throw new Error("Weather API request failed");
  }
  
  const data = await response.json();
  return data.map((city: any) => ({
    name: city.name,
    country: city.country,
    region: city.region,
    lat: city.lat,
    lon: city.lon,
    url: city.url
  }));
}

async function getAstronomyData(lat: number, lon: number) {
  const API_KEY = process.env.WEATHER_API_KEY;
  if (!API_KEY) {
    throw new Error("Weather API key not configured");
  }
  
  const response = await fetch(
    `https://api.weatherapi.com/v1/astronomy.json?key=${API_KEY}&q=${lat},${lon}`
  );
  
  if (!response.ok) {
    throw new Error("Weather API request failed");
  }
  
  const data = await response.json();
  return {
    sunrise: data.astronomy.astro.sunrise,
    sunset: data.astronomy.astro.sunset,
    moonrise: data.astronomy.astro.moonrise,
    moonset: data.astronomy.astro.moonset,
    moonPhase: data.astronomy.astro.moon_phase,
    moonIllumination: data.astronomy.astro.moon_illumination
  };
}

async function getAstronomyDataByCity(city: string) {
  const API_KEY = process.env.WEATHER_API_KEY;
  if (!API_KEY) {
    throw new Error("Weather API key not configured");
  }
  
  const response = await fetch(
    `https://api.weatherapi.com/v1/astronomy.json?key=${API_KEY}&q=${encodeURIComponent(city)}`
  );
  
  if (!response.ok) {
    throw new Error("Weather API request failed");
  }
  
  const data = await response.json();
  return {
    sunrise: data.astronomy.astro.sunrise,
    sunset: data.astronomy.astro.sunset,
    moonrise: data.astronomy.astro.moonrise,
    moonset: data.astronomy.astro.moonset,
    moonPhase: data.astronomy.astro.moon_phase,
    moonIllumination: data.astronomy.astro.moon_illumination
  };
}

// Transform functions to match the expected data structure
function transformWeatherData(data: any) {
  return {
    temperature: data.current.temp_c,
    feelsLike: data.current.feelslike_c,
    humidity: data.current.humidity,
    windSpeed: data.current.wind_kph,
    windDirection: data.current.wind_degree,
    windDir: data.current.wind_dir,
    uvIndex: data.current.uv,
    visibility: data.current.vis_km,
    pressure: data.current.pressure_mb,
    dewPoint: data.current.dewpoint_c,
    description: data.current.condition.text,
    icon: data.current.condition.icon,
    city: data.location.name,
    country: data.location.country,
    region: data.location.region,
    condition: data.current.condition.text,
    lat: data.location.lat,
    lon: data.location.lon,
    localtime: data.location.localtime,
    aqi: data.current.air_quality ? {
      co: data.current.air_quality.co,
      no2: data.current.air_quality.no2,
      o3: data.current.air_quality.o3,
      so2: data.current.air_quality.so2,
      pm2_5: data.current.air_quality.pm2_5,
      pm10: data.current.air_quality.pm10,
      us_epa_index: data.current.air_quality['us-epa-index'],
      gb_defra_index: data.current.air_quality['gb-defra-index']
    } : undefined
  };
}

function transformHourlyForecast(hours: any[]) {
  return hours.map(hour => ({
    time: hour.time,
    temperature: hour.temp_c,
    icon: hour.condition.icon,
    description: hour.condition.text,
    humidity: hour.humidity,
    windSpeed: hour.wind_kph,
    chanceOfRain: hour.chance_of_rain,
    feelsLike: hour.feelslike_c
  }));
}

function transformDailyForecast(days: any[]) {
  return days.map(day => ({
    date: day.date,
    minTemp: day.day.mintemp_c,
    maxTemp: day.day.maxtemp_c,
    icon: day.day.condition.icon,
    description: day.day.condition.text,
    humidity: day.day.avghumidity,
    windSpeed: day.day.maxwind_kph,
    chanceOfRain: day.day.daily_chance_of_rain,
    sunrise: day.astro.sunrise,
    sunset: day.astro.sunset,
    moonrise: day.astro.moonrise,
    moonset: day.astro.moonset,
    moonPhase: day.astro.moon_phase,
    uvIndex: day.day.uv
  }));
}
