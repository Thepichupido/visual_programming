export type City = {
  name: string
  lat: number
  lon: number
  country: string
}

export type ForecastItem = {
  dt: number
  dt_txt: string
  main: {
    temp: number
    humidity: number
    pressure: number
  }
  weather: {
    main: string
    description: string
    icon: string
  }[]
  wind: {
    speed: number
  }
}

export type ForecastResponse = {
  city: {
    name: string
    country: string
  }
  list: ForecastItem[]
}

export type AirPollution = {
  list: {
    main: {
      aqi: number
    }
    components: {
      co: number
      no2: number
      o3: number
      pm2_5: number
      pm10: number
    }
  }[]
}