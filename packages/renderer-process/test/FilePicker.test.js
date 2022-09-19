/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as FilePicker from '../src/parts/FilePicker/FilePicker.js'

beforeAll(() => {
  // workaround for jsdom not supporting file picker apis
  // @ts-ignore
  window.showDirectoryPicker = jest.fn()
  // @ts-ignore
  window.showFilePicker = jest.fn()
  // @ts-ignore
  window.showSaveFilePicker = jest.fn()
})

beforeEach(() => {
  jest.resetAllMocks()
})

test('showDirectoryPicker - error', async () => {
  // @ts-ignore
  window.showDirectoryPicker.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(FilePicker.showDirectoryPicker()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('showDirectoryPicker - error - canceled', async () => {
  // @ts-ignore
  window.showDirectoryPicker.mockImplementation(async () => {
    throw new Error('The user aborted a request.')
  })
  await expect(FilePicker.showDirectoryPicker()).rejects.toThrowError(
    new Error('The user aborted a request.')
  )
})

test('showDirectoryPicker - error - not implemented', async () => {
  // @ts-ignore
  window.showDirectoryPicker.mockImplementation(async () => {
    throw new Error('window.showDirectoryPicker is not a function')
  })
  await expect(FilePicker.showDirectoryPicker()).rejects.toThrowError(
    new Error('window.showDirectoryPicker is not a function')
  )
})

test('showDirectoryPicker', async () => {
  // @ts-ignore
  window.showDirectoryPicker.mockImplementation(async () => {
    return {
      kind: 'directory',
      name: 'test-folder',
    }
  })
  expect(await FilePicker.showDirectoryPicker()).toEqual({
    kind: 'directory',
    name: 'test-folder',
  })
  // @ts-ignore
  expect(window.showDirectoryPicker).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(window.showDirectoryPicker).toHaveBeenCalledWith(undefined)
})

test('showFilePicker - error', async () => {
  // @ts-ignore
  window.showFilePicker.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(FilePicker.showFilePicker()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('showSaveFilePicker - error', async () => {
  // @ts-ignore
  window.showSaveFilePicker.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(FilePicker.showSaveFilePicker()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})
