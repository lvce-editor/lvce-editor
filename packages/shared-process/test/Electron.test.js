import { jest } from '@jest/globals'
import * as Electron from '../src/parts/Electron/Electron.js'

test('toggleDevtools', () => {
  Electron.state.send = jest.fn()
  Electron.toggleDevtools()
  expect(Electron.state.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    method: 6523,
    params: [],
  })
})

test('windowMinimize', () => {
  Electron.state.send = jest.fn()
  Electron.windowMinimize()
  expect(Electron.state.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    method: 6521,
    params: [],
  })
})

test('windowMaximize', () => {
  Electron.state.send = jest.fn()
  Electron.windowMaximize()
  expect(Electron.state.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    method: 6522,
    params: [],
  })
})

test('windowUnmaximize', () => {
  Electron.state.send = jest.fn()
  Electron.windowUnmaximize()
  expect(Electron.state.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    method: 6524,
    params: [],
  })
})

test('windowClose', () => {
  Electron.state.send = jest.fn()
  Electron.windowClose()
  expect(Electron.state.send).toBeCalledWith({
    jsonrpc: '2.0',
    method: 6525,
    params: [],
  })
})

test('windowReload', () => {
  Electron.state.send = jest.fn()
  Electron.windowReload()
  expect(Electron.state.send).toBeCalledWith({
    jsonrpc: '2.0',
    method: 6526,
    params: [],
  })
})

test('about', () => {
  Electron.state.send = jest.fn()
  Electron.about()
  expect(Electron.state.send).toBeCalledWith({
    jsonrpc: '2.0',
    method: 20001,
    params: [],
  })
})

test('showOpenDialog', () => {
  Electron.state.send = jest.fn()
  Electron.showOpenDialog()
  expect(Electron.state.send).toBeCalledWith({
    jsonrpc: '2.0',
    method: 20100,
    params: [],
    id: expect.any(Number),
  })
})

test('crashMainProcess', () => {
  Electron.state.send = jest.fn()
  Electron.crashMainProcess()
  expect(Electron.state.send).toBeCalledWith({
    jsonrpc: '2.0',
    method: 7723,
    params: [],
  })
})
