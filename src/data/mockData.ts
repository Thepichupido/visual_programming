import type { AirPollution, ForecastResponse } from '../types'

export const mockForecast: ForecastResponse = {
  city: {
    name: 'Moscow',
    country: 'RU',
  },
  list: [
    {
      dt: 1,
      dt_txt: '2026-06-15 12:00:00',
      main: {
        temp: 27,
        humidity: 80,
        pressure: 756,
      },
      weather: [
        {
          main: 'Clear',
          description: 'ясно',
          icon: '01d',
        },
      ],
      wind: {
        speed: 5,
      },
    },
    {
      dt: 2,
      dt_txt: '2026-06-16 12:00:00',
      main: {
        temp: 26,
        humidity: 75,
        pressure: 754,
      },
      weather: [
        {
          main: 'Clouds',
          description: 'облачно',
          icon: '03d',
        },
      ],
      wind: {
        speed: 4,
      },
    },
    {
      dt: 3,
      dt_txt: '2026-06-17 12:00:00',
      main: {
        temp: 24,
        humidity: 70,
        pressure: 752,
      },
      weather: [
        {
          main: 'Rain',
          description: 'дождь',
          icon: '10d',
        },
      ],
      wind: {
        speed: 6,
      },
    },
  ],
}

export const mockAir: AirPollution = {
  list: [
    {
      main: {
        aqi: 2,
      },
      components: {
        co: 210,
        no2: 12,
        o3: 55,
        pm2_5: 8,
        pm10: 15,
      },
    },
  ],
}