import { cleanup, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, it, expect } from 'vitest'
import App from './App'

afterEach(() => {
  cleanup()
})

describe('Тесты приложения погоды', () => {
  it('отображается поле ввода города', () => {
    render(<App />)

    expect(screen.getByPlaceholderText('Введите город')).toBeInTheDocument()
  })

  it('отображается кнопка поиска', () => {
    render(<App />)

    expect(screen.getByText('Найти')).toBeInTheDocument()
  })

  it('отображается переключатель моков', () => {
    render(<App />)

    expect(screen.getByLabelText(/Использовать моки/i)).toBeInTheDocument()
  })
})