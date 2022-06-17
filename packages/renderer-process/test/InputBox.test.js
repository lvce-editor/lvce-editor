/**
 * @jest-environment jsdom
 */
import * as InputBox from '../src/parts/InputBox/InputBox.js'

test('create', () => {
  const $InputBox = InputBox.create()
  expect($InputBox).toBeInstanceOf(HTMLInputElement)
})
