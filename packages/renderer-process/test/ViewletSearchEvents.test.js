/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.ts'
import { beforeEach, test, expect } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js', () => {
  return {
    executeViewletCommand: jest.fn(() => {}),
  }
})
const ExecuteViewletCommand = await import('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js')
const ViewletSearch = await import('../src/parts/ViewletSearch/ViewletSearch.js')

test.skip('event - input', () => {
  const state = ViewletSearch.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletSearch.attachEvents(state)
  const { $ViewletSearchInput } = state
  $ViewletSearchInput.value = 'test search'
  const event = new Event('input', {
    bubbles: true,
    cancelable: true,
  })
  $ViewletSearchInput.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleInput', 'test search', 1)
})
