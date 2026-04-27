import { useEffect, useState } from 'react'
import './App.css'

import { getAirPollution, getCityCoords, getForecast } from './api/weatherApi'
import { AirInfo } from './components/AirInfo'
import { CitySearch } from './components/CitySearch'
import { CurrentWeather } from './components/CurrentWeather'
import { ForecastList } from './components/ForecastList'
import { mockAir, mockForecast } from './data/mockData'
import type { AirPollution, ForecastResponse } from './types'

function getBackground(weather?: string) {
  if (!weather) {
    return 'default-bg'
  }

  const value = weather.toLowerCase()

  if (value.includes('clear')) {
    return 'sunny-bg'
  }

  if (value.includes('rain')) {
    return 'rain-bg'
  }

  if (value.includes('cloud')) {
    return 'cloud-bg'
  }

  if (value.includes('snow')) {
    return 'snow-bg'
  }

  return 'default-bg'
}

function App() {
  const [forecast, setForecast] = useState<ForecastResponse | null>(null)
  const [air, setAir] = useState<AirPollution | null>(null)
  const [city, setCity] = useState('Moscow')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [useMock, setUseMock] = useState(false)

  async function loadWeather(cityName: string) {
    setLoading(true)
    setError('')
    setCity(cityName)

    try {
      if (useMock) {
        setForecast(mockForecast)
        setAir(mockAir)
        return
      }

      const cityInfo = await getCityCoords(cityName)
      const forecastData = await getForecast(cityInfo.lat, cityInfo.lon)
      const airData = await getAirPollution(cityInfo.lat, cityInfo.lon)

      setForecast(forecastData)
      setAir(airData)
    } catch {
      setError('Не получилось загрузить погоду')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWeather(city)

    const timer = setInterval(() => {
      loadWeather(city)
    }, 3 * 60 * 60 * 1000)

    return () => clearInterval(timer)
  }, [useMock])

  const currentWeather = forecast?.list[0]
  const background = getBackground(currentWeather?.weather[0].main)

  return (
    <main className={`app ${background}`}>
      <section className="weather-app">
        <div className="top-panel">
          <CitySearch onSearch={loadWeather} />

          <label className="mock-label">
            <input
              type="checkbox"
              checked={useMock}
              onChange={() => setUseMock(!useMock)}
            />
            Использовать моки
          </label>
        </div>

        {loading && <p className="message">Загрузка...</p>}
        {error && <p className="error">{error}</p>}

        {forecast && currentWeather && (
          <>
            <CurrentWeather city={forecast.city.name} weather={currentWeather} />
            <ForecastList items={forecast.list} />
          </>
        )}

        {air && <AirInfo air={air} />}
      </section>
    </main>
  )
}

export default App