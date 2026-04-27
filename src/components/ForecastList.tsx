import type { ForecastItem } from '../types'

type Props = {
  items: ForecastItem[]
}

function getDayName(dateText: string) {
  const date = new Date(dateText)

  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function ForecastList({ items }: Props) {
  const days = items.filter((item) => item.dt_txt.includes('12:00:00'))

  return (
    <div className="forecast-list">
      <h3>Прогноз на несколько дней</h3>

      {days.map((item) => (
        <div className="forecast-item" key={item.dt}>
          <span>{getDayName(item.dt_txt)}</span>

          <img
            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
            alt={item.weather[0].description}
          />

          <b>{Math.round(item.main.temp)}°</b>
        </div>
      ))}
    </div>
  )
}