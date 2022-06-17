/**
 * @jest-environment jsdom
 */
import * as ViewletTerminal from '../src/parts/Viewlet/ViewletTerminal.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import { jest } from '@jest/globals'
import { TextEncoder, TextDecoder } from 'node:util'

beforeAll(() => {
  // https://github.com/jsdom/jsdom/issues/2524#issuecomment-736672511
  globalThis.TextEncoder = TextEncoder
})

test('name', () => {
  expect(ViewletTerminal.name).toBe('Terminal')
})

test('create', () => {
  const state = ViewletTerminal.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = ViewletTerminal.create()
  expect(await ViewletTerminal.loadContent(state)).toMatchObject({
    disposed: false,
  })
})

test('handleData', () => {
  RendererProcess.state.send = jest.fn()
  const state = ViewletTerminal.create()
  ViewletTerminal.handleData(state, {
    data: [1, 2, 3, 4, 5],
  })
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    9922,
    new Uint8Array([1, 2, 3, 4, 5]),
  ])
})

test('write', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Terminal.write':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  const state = ViewletTerminal.create()
  await ViewletTerminal.write(state, 'abc')
  expect(SharedProcess.state.send).toHaveBeenCalledTimes(1)
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    id: expect.any(Number),
    method: 'Terminal.write',
    params: [0, 'abc'],
  })
})

test('clear', () => {
  RendererProcess.state.send = jest.fn()
  const state = ViewletTerminal.create()
  ViewletTerminal.clear(state)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    9922,
    new TextEncoder().encode('TODO clear terminal'),
  ])
})

test('resize', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Terminal.resize':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  const state = ViewletTerminal.create()
  await ViewletTerminal.resize(state, 10, 10)
  expect(SharedProcess.state.send).toHaveBeenCalledTimes(1)
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    id: expect.any(Number),
    method: 'Terminal.resize',
    params: [0, 7, 1],
  })
})

test('dispose', () => {
  const state = ViewletTerminal.create()
  expect(ViewletTerminal.dispose(state)).toMatchObject({
    disposed: true,
  })
})
