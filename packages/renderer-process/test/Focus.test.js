/**
 * @jest-environment jsdom
 */
import * as Focus from '../src/parts/Focus/Focus.js'

test('focus', () => {
  const $Element = document.createElement('button')
  document.body.append($Element)
  Focus.focus($Element)
  expect(document.activeElement).toBe($Element)
})

test('focus - when element is already focused', () => {
  const $Element = document.createElement('button')
  document.body.append($Element)
  $Element.focus()
  Focus.focus($Element)
  expect(document.activeElement).toBe($Element)
})

test('focusPrevious', () => {
  const $Element1 = document.createElement('button')
  const $Element2 = document.createElement('button')
  document.body.append($Element1, $Element2)
  Focus.focus($Element1)
  Focus.focus($Element2)
  Focus.focusPrevious()
  expect(document.activeElement).toBe($Element1)
})
