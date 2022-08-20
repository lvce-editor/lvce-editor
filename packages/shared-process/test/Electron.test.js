import { jest } from '@jest/globals'
import * as Electron from '../src/parts/Electron/Electron.js'

test('toggleDevtools', async () => {
  Electron.state.invoke = jest.fn(async () => {})
  await Electron.toggleDevtools()
  expect(Electron.state.invoke).toHaveBeenCalledTimes(1)
  expect(Electron.state.invoke).toHaveBeenCalledWith('Window.toggleDevtools')
})

test('windowMinimize', async () => {
  Electron.state.invoke = jest.fn(async () => {})
  await Electron.windowMinimize()
  expect(Electron.state.invoke).toHaveBeenCalledTimes(1)
  expect(Electron.state.invoke).toHaveBeenCalledWith('Window.minimize')
})

test('windowMaximize', async () => {
  Electron.state.invoke = jest.fn(async () => {})
  await Electron.windowMaximize()
  expect(Electron.state.invoke).toHaveBeenCalledTimes(1)
  expect(Electron.state.invoke).toHaveBeenCalledWith('Window.maximize')
})

test('windowUnmaximize', async () => {
  Electron.state.invoke = jest.fn(async () => {})
  await Electron.windowUnmaximize()
  expect(Electron.state.invoke).toHaveBeenCalledTimes(1)
  expect(Electron.state.invoke).toHaveBeenCalledWith('Window.unmaximize')
})

test('windowClose', async () => {
  Electron.state.invoke = jest.fn(async () => {})
  await Electron.windowClose()
  expect(Electron.state.invoke).toHaveBeenCalledTimes(1)
  expect(Electron.state.invoke).toBeCalledWith('Window.close')
})

test('windowReload', async () => {
  Electron.state.invoke = jest.fn(async () => {})
  await Electron.windowReload()
  expect(Electron.state.invoke).toHaveBeenCalledTimes(1)
  expect(Electron.state.invoke).toBeCalledWith('Window.reload')
})

test('about', async () => {
  Electron.state.invoke = jest.fn(async () => {})
  await Electron.about()
  expect(Electron.state.invoke).toHaveBeenCalledTimes(1)
  expect(Electron.state.invoke).toHaveBeenCalledWith('About.open')
})

test('showOpenDialog', async () => {
  Electron.state.invoke = jest.fn(async () => {})
  await Electron.showOpenDialog('Open Folder')
  expect(Electron.state.invoke).toHaveBeenCalledTimes(1)
  expect(Electron.state.invoke).toBeCalledWith(
    'Dialog.showOpenDialog',
    'Open Folder'
  )
})

test('crashMainProcess', async () => {
  Electron.state.invoke = jest.fn(async () => {})
  await Electron.crashMainProcess()
  expect(Electron.state.invoke).toHaveBeenCalledTimes(1)
  expect(Electron.state.invoke).toBeCalledWith('Developer.crashMainProcess')
})
