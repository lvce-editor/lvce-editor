/**
 * @jest-environment jsdom
 */
import { expect, jest, test } from '@jest/globals'
import * as Open from '../src/parts/Open/Open.ts'

test('openUrl', () => {
  const spy = jest.spyOn(globalThis, 'open').mockImplementation(() => {
    return null
  })
  Open.openUrl('test://test.txt')
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('test://test.txt')
})
