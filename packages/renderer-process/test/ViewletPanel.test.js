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

const ViewletPanel = await import('../src/parts/ViewletPanel/ViewletPanel.js')

test('create', () => {
  const state = ViewletPanel.create()
  expect(state).toBeDefined()
})
