import type { ForecastItem } from '../types'

type Props = {
  city: string
  weather: ForecastItem
}

export function CurrentWeather({ city, weather }: Props) {
  const icon = weather.weather[0].icon
  const description = weather.weather[0].description

  return (
    <div className="current-card">
      <p className="date">Сейчас</p>

      <h2>{city}</h2>

      <div className="main-weather">
        <div>
          <h1>{Math.round(weather.main.temp)}°</h1>
          <p>{description}</p>
        </div>

        <img
          src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
          alt={description}
        />
      </div>

      <div className="details">
        <div>
          <span>Влажность</span>
          <b>{weather.main.humidity}%</b>
        </div>

        <div>
          <span>Ветер</span>
          <b>{weather.wind.speed} м/с</b>
        </div>

        <div>
          <span>Давление</span>
          <b>{weather.main.pressure} гПа</b>
        </div>
      </div>
    </div>
  )
}