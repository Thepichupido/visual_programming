import { useState } from 'react'

type Props = {
  onSearch: (city: string) => void
}

export function CitySearch({ onSearch }: Props) {
  const [city, setCity] = useState('Moscow')

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (city.trim()) {
      onSearch(city)
    }
  }

  return (
    <form className="search" onSubmit={handleSubmit}>
      <input
        value={city}
        onChange={(event) => setCity(event.target.value)}
        placeholder="Введите город"
      />

      <button type="submit">Найти</button>
    </form>
  )
}