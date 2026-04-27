import type { AirPollution } from '../types'

type Props = {
  air: AirPollution
}

function getAirText(aqi: number) {
  switch (aqi) {
    case 1:
      return 'Хорошее'
    case 2:
      return 'Нормальное'
    case 3:
      return 'Среднее'
    case 4:
      return 'Плохое'
    case 5:
      return 'Очень плохое'
    default:
      return 'Нет данных'
  }
}

export function AirInfo({ air }: Props) {
  const info = air.list[0]

  return (
    <div className="air-card">
      <h3>Загрязнение воздуха</h3>

      <p>
        Качество воздуха: <b>{getAirText(info.main.aqi)}</b>
      </p>

      <div className="air-grid">
        <span>CO: {info.components.co}</span>
        <span>NO₂: {info.components.no2}</span>
        <span>O₃: {info.components.o3}</span>
        <span>PM2.5: {info.components.pm2_5}</span>
        <span>PM10: {info.components.pm10}</span>
      </div>
    </div>
  )
}