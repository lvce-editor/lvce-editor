import { expect, test } from '@jest/globals'
import { getViewletErrorMessage } from '../src/parts/GetViewletErrorMessage/GetViewletErrorMessage.js'

test('formats the message, code frame, and stack in order', () => {
  expect(
    getViewletErrorMessage({
      codeFrame: `  4 |     create() {
> 5 |       throw new Error('create failed')
    |             ^`,
      message: 'create failed',
      stack: `Error: create failed
    at Object.create (main.ts:5:13)`,
      type: 'Error',
    }),
  ).toBe(`Error: create failed

  4 |     create() {
> 5 |       throw new Error('create failed')
    |             ^

    at Object.create (main.ts:5:13)`)
})

test('omits empty code frame and stack sections', () => {
  expect(
    getViewletErrorMessage({
      codeFrame: '',
      message: 'create failed',
      stack: '',
      type: 'Error',
    }),
  ).toBe('Error: create failed')
})

test('does not duplicate a type already included in the prepared message', () => {
  expect(
    getViewletErrorMessage({
      codeFrame: '',
      message: 'Error: create failed',
      stack: '',
      type: 'Error',
    }),
  ).toBe('Error: create failed')
})

test('preserves a stack whose first line does not duplicate the message', () => {
  expect(
    getViewletErrorMessage({
      message: 'create failed',
      stack: `Caused by: connection failed
    at Object.create (main.ts:5:13)`,
      type: 'Error',
    }),
  ).toBe(`Error: create failed

Caused by: connection failed
    at Object.create (main.ts:5:13)`)
})

test('omits a stack containing only the duplicate message', () => {
  expect(
    getViewletErrorMessage({
      message: 'create failed',
      stack: 'Error: create failed',
      type: 'Error',
    }),
  ).toBe('Error: create failed')
})
