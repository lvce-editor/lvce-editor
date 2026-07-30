import { beforeEach, expect, jest, test } from '@jest/globals'
import { handleMacOsSaveShortcut } from '../src/handleMacOsSaveShortcut.js'

const event = {
  preventDefault: jest.fn(),
}

const webContents = {
  sendInputEvent: jest.fn(),
}

beforeEach(() => {
  jest.resetAllMocks()
})

test('translates Command+S to the existing Control+S save binding on macOS', async () => {
  handleMacOsSaveShortcut(
    event,
    {
      control: false,
      key: 's',
      meta: true,
      shift: false,
      type: 'keyDown',
    },
    webContents,
    'darwin',
  )
  await Promise.resolve()

  expect(event.preventDefault).toHaveBeenCalledTimes(1)
  expect(webContents.sendInputEvent).toHaveBeenNthCalledWith(1, {
    keyCode: 'S',
    modifiers: ['control'],
    type: 'keyDown',
  })
  expect(webContents.sendInputEvent).toHaveBeenNthCalledWith(2, {
    keyCode: 'S',
    modifiers: ['control'],
    type: 'keyUp',
  })
})

test('leaves Command+Shift+S unchanged', async () => {
  handleMacOsSaveShortcut(
    event,
    {
      control: false,
      key: 'S',
      meta: true,
      shift: true,
      type: 'keyDown',
    },
    webContents,
    'darwin',
  )
  await Promise.resolve()

  expect(event.preventDefault).not.toHaveBeenCalled()
  expect(webContents.sendInputEvent).not.toHaveBeenCalled()
})

test('leaves other input unchanged', () => {
  handleMacOsSaveShortcut(
    event,
    {
      control: false,
      key: 's',
      meta: true,
      shift: false,
      type: 'keyDown',
    },
    webContents,
    'linux',
  )

  expect(event.preventDefault).not.toHaveBeenCalled()
  expect(webContents.sendInputEvent).not.toHaveBeenCalled()
})
