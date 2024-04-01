/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => {
  return {
    send: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletPanel = await import('../src/parts/ViewletPanel/ViewletPanel.ts')

test('create', () => {
  const state = ViewletPanel.create()
  expect(state).toBeDefined()
})
