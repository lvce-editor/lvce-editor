/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js', () => {
  return {
    executeViewletCommand: jest.fn(() => {}),
  }
})

const ExecuteViewletCommand = await import('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js')
const ViewletAudio = await import('../src/parts/ViewletAudio/ViewletAudio.js')

test('event - error', () => {
  const state = ViewletAudio.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletAudio.attachEvents(state)
  const { $Audio } = state
  // @ts-ignore
  $Audio.error = {
    code: 4,
    message: 'MEDIA_ELEMENT_ERROR: Media load rejected by URL safety check',
  }
  const event = new Event('error')
  $Audio.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(
    1,
    'handleAudioError',
    4,
    'MEDIA_ELEMENT_ERROR: Media load rejected by URL safety check'
  )
})
