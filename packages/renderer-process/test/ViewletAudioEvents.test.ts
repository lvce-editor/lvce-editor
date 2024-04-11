/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.ts'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.ts', () => {
  return {
    executeViewletCommand: jest.fn(() => {}),
  }
})

const ExecuteViewletCommand = await import('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.ts')
const ViewletAudio = await import('../src/parts/ViewletAudio/ViewletAudio.ts')

test.skip('event - error', () => {
  const state = ViewletAudio.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletAudio.attachEvents(state)
  // @ts-ignore
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
    'MEDIA_ELEMENT_ERROR: Media load rejected by URL safety check',
  )
})
