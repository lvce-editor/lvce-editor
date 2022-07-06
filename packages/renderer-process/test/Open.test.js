/**
 * @jest-environment jsdom
 */
import * as Open from '../src/parts/Open/Open.js'
import { jest } from '@jest/globals'

test('openUrl', () => {
  const spy = jest.spyOn(globalThis, 'open').mockImplementation(() => {
    return null
  })
  Open.openUrl('test://test.txt')
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('test://test.txt')
})
