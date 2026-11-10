import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/IsProduction/IsProduction.js', () => ({
  isProduction: true,
}))

const Logger = await import('../src/parts/Logger/Logger.js')

test('suppresses info and warnings in production while retaining errors', () => {
  const info = jest.spyOn(console, 'info').mockImplementation(() => {})
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const error = jest.spyOn(console, 'error').mockImplementation(() => {})
  Logger.info('info message')
  Logger.warn('warning message')
  Logger.error('error message')

  expect(info).not.toHaveBeenCalled()
  expect(warn).not.toHaveBeenCalled()
  expect(error).toHaveBeenCalledWith('error message')
})
