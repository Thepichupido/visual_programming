import type { AirPollution, City, ForecastResponse } from '../types'

const API_KEY = '22c33e4519538d3e3786d28dfc70beec'
const BASE_URL = 'https://api.openweathermap.org'

export async function getCityCoords(city: string): Promise<City> {
  const response = await fetch(
    `${BASE_URL}/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`,
  )

  if (!response.ok) {
    throw new Error('Ошибка поиска города')
  }

  const data = await response.json()

  if (data.length === 0) {
    throw new Error('Город не найден')
  }

  return data[0]
}

export async function getForecast(
  lat: number,
  lon: number,
): Promise<ForecastResponse> {
  const response = await fetch(
    `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`,
  )

  if (!response.ok) {
    throw new Error('Ошибка загрузки прогноза')
  }

  return response.json()
}

export async function getAirPollution(
  lat: number,
  lon: number,
): Promise<AirPollution> {
  const response = await fetch(
    `${BASE_URL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
  )

  if (!response.ok) {
    throw new Error('Ошибка загрузки данных о воздухе')
  }

  return response.json()
}