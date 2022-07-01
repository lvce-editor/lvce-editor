import { jest } from '@jest/globals'

export const mockModule = async (relativePath, mock) => {
  jest.unstable_mockModule(relativePath, mock)
  const module = await import(relativePath)
  return module
}

beforeEach(() => {
  jest.resetAllMocks()
})
