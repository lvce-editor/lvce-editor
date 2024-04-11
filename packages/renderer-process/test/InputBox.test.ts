/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as InputBox from '../src/parts/InputBox/InputBox.ts'

test('create', () => {
  const $InputBox = InputBox.create()
  expect($InputBox).toBeInstanceOf(HTMLInputElement)
})
