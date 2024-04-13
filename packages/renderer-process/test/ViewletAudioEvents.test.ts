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
const ViewletAudioEvents = await import('../src/parts/ViewletAudio/ViewletAudioEvents.ts')

test('event - error', () => {
  const $Element = document.createElement('div')
  ComponentUid.set($Element, 1)
  // @ts-ignore
  $Element.error = {
    code: 4,
    message: 'MEDIA_ELEMENT_ERROR: Media load rejected by URL safety check',
  }
  ViewletAudioEvents.handleAudioError({
    target: $Element,
  })
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(
    1,
    'handleAudioError',
    4,
    'MEDIA_ELEMENT_ERROR: Media load rejected by URL safety check',
  )
})
