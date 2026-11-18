import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import * as RendererFrameScheduler from '../src/parts/RendererFrameScheduler/RendererFrameScheduler.js'
import { Commands } from '../src/parts/WindowTitle/WindowTitle.ipc.js'
import * as WindowTitle from '../src/parts/WindowTitle/WindowTitle.js'

const rpc = { invoke: jest.fn(async (..._args: readonly unknown[]) => {}) }

beforeEach(() => {
  jest.clearAllMocks()
  RendererFrameScheduler.reset(rpc)
})

afterEach(() => {
  RendererFrameScheduler.reset(undefined)
})

test('setTitle', async () => {
  await WindowTitle.set('test')
  expect(rpc.invoke).toHaveBeenCalledTimes(1)
  expect(rpc.invoke).toHaveBeenCalledWith('WindowTitle.set', 'test')
})

test.each(['https://trello.com/icon.png', ''])('forwards the dedicated favicon command: %s', async (href) => {
  expect(Commands.setFavicon).toBe(WindowTitle.setFavicon)
  await Commands.setFavicon(href)
  expect(rpc.invoke).toHaveBeenCalledTimes(1)
  expect(rpc.invoke).toHaveBeenCalledWith('Favicon.set', href)
})
