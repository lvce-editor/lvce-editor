/**
 * Need jsdom because of setInterval is different in node
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ViewletClock from '../src/parts/ViewletClock/ViewletClock.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

test('create', () => {
  const state = ViewletClock.create(0)
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = ViewletClock.create(0)
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  Date.now = jest.fn(() => 1627023800366)
  expect(await ViewletClock.loadContent(state)).toEqual({
    id: 0,
    interval: expect.any(Number),
    disposed: false,
  })
})

test('dispose', () => {
  // TODO check that interval really has been cleared
  const state = ViewletClock.create(0)
  ViewletClock.dispose(state)
  expect(state).toEqual({
    id: 0,
    interval: -1,
    disposed: true,
  })
})

test('dispose - already disposed', () => {
  // TODO check that interval really has been cleared
  const state = ViewletClock.create(0)
  ViewletClock.dispose(state)
  ViewletClock.dispose(state)
  expect(state).toEqual({
    id: 0,
    interval: -1,
    disposed: true,
  })
})
