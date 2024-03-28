/**
 * @jest-environment jsdom
 */
import * as InputBox from '../src/parts/InputBox/InputBox.js'
import { beforeEach, test, expect } from '@jest/globals'

test('create', () => {
  const $InputBox = InputBox.create()
  expect($InputBox).toBeInstanceOf(HTMLInputElement)
})
