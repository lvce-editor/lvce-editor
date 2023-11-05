/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.js', () => {
  return {
    send: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererWorker = await import('../src/parts/RendererWorker/RendererWorker.js')

const ViewletLocations = await import('../src/parts/ViewletLocations/ViewletLocations.js')

test('create', () => {
  const state = ViewletLocations.create()
  expect(state).toBeDefined()
})
