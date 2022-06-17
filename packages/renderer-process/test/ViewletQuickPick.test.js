/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as QuickPick from '../src/parts/Viewlet/ViewletQuickPick.js'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.js'

test('create', () => {
  const state = QuickPick.create('>')
  QuickPick.setValueAndPicks(state, '>', [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  expect(state.$QuickPick).toBeDefined()
  expect(state.$QuickPickInput.value).toBe('>')
  const $QuickPickItemOne = state.$QuickPickItems.children[0]
  const $QuickPickItemTwo = state.$QuickPickItems.children[1]
  expect($QuickPickItemOne.textContent).toBe('item 1')
  expect($QuickPickItemTwo.textContent).toBe('item 2')
})

test('focusIndex', () => {
  const state = QuickPick.create('>')
  QuickPick.setValueAndPicks(state, '>', [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  QuickPick.focusIndex(state, 0, 1)
  const $QuickPickItemOne = state.$QuickPickItems.children[0]
  const $QuickPickItemTwo = state.$QuickPickItems.children[1]
  expect($QuickPickItemOne.classList.contains('Focused')).toBe(false)
  expect($QuickPickItemTwo.classList.contains('Focused')).toBe(true)
})

test('updateValueAndPicks - less picks', () => {
  const state = QuickPick.create('>')
  QuickPick.updateValueAndPicks(
    state,
    '>',
    [
      {
        posInSet: 1,
        setSize: 2,
        label: 'item 1',
      },
      {
        posInSet: 2,
        setSize: 2,
        label: 'item 2',
      },
    ],
    1,
    -1
  )
  QuickPick.updateValueAndPicks(state, '>', [], -1, 1)
  expect(state.$QuickPickItems.children).toHaveLength(0)
})

test('event - mousedown', () => {
  const state = QuickPick.create('>')
  QuickPick.setValueAndPicks(state, '>', [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  const $QuickPickItemTwo = state.$QuickPickItems.children[1]
  RendererWorker.state.send = jest.fn()
  $QuickPickItemTwo.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.state.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.state.send).toHaveBeenCalledWith([71182, 1])
})

test('event - mousedown - on focused item', () => {
  const state = QuickPick.create('>')
  QuickPick.updateValueAndPicks(
    state,
    '>',
    [
      {
        posInSet: 1,
        setSize: 1,
        label: 'item 1',
      },
    ],
    0,
    -1
  )
  const $QuickPickItemOne = state.$QuickPickItems.children[0]
  RendererWorker.state.send = jest.fn()
  $QuickPickItemOne.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.state.send).toHaveBeenCalledWith([71182, 0])
})

test('event - beforeinput', () => {
  const state = QuickPick.create('>')
  QuickPick.setValueAndPicks(state, '>', [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  const $QuickPickInput = state.$QuickPickInput
  RendererWorker.state.send = jest.fn()
  $QuickPickInput.dispatchEvent(
    new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      data: 'a',
    })
  )
  expect(RendererWorker.state.send).toHaveBeenCalledWith([71181, '>a'])
})

test('event - input', () => {
  const state = QuickPick.create('>', [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  const $QuickPickInput = state.$QuickPickInput
  RendererWorker.state.send = jest.fn()
  $QuickPickInput.value = '>a'
  $QuickPickInput.dispatchEvent(
    new InputEvent('input', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.state.send).toHaveBeenCalledWith([71181, '>a'])
})

test('accessibility - QuickPick should have aria label', () => {
  const state = QuickPick.create('>', [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  expect(state.$QuickPick.ariaLabel).toBe('Quick open')
})

test('accessibility - QuickPickInput should have aria label', () => {
  const state = QuickPick.create('>')
  QuickPick.setValueAndPicks(state, '>', [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  expect(state.$QuickPickInput.ariaLabel).toBe(
    'Type the name of a command to run.'
  )
})

test('accessibility - aria-activedescendant should point to quick pick item', () => {
  const state = QuickPick.create('>')
  QuickPick.setValueAndPicks(state, '>', [
    {
      posInSet: 1,
      setSize: 2,
      label: 'item 1',
    },
    {
      posInSet: 2,
      setSize: 2,
      label: 'item 2',
    },
  ])
  expect(state.$QuickPickInput.getAttribute('aria-activedescendant')).toBe(
    'QuickPickItem-1'
  )
  expect(state.$QuickPickItems.children[0].id).toBe('QuickPickItem-1')
})
