import * as ViewletSearchEvents from '../src/parts/ViewletSearch/ViewletSearchEvents.ts'
import { test, expect } from '@jest/globals'

test('handleInput', () => {
  const event = {
    target: {
      value: 'abc'
    }
  } as any
  expect(ViewletSearchEvents.handleInput(event)).toEqual([
    'handleInput', 'abc', 1
  ])
})

test('handleFocus', () => {
  expect(ViewletSearchEvents.handleFocus()).toEqual([
    'Focus.setFocus', 21
  ])
})