/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as Dialog from '../src/parts/Dialog/Dialog.js'
import * as Widget from '../src/parts/Widget/Widget.js'

beforeEach(() => {
  document.body.textContent = ''
  Widget.state.widgetSet = new Set()
})

test.skip('prompt', () => {
  const spy = jest
    .spyOn(window, 'prompt')
    .mockImplementation(() => 'test output')
  expect(Dialog.prompt('test message')).toBe('test output')
  expect(spy).toHaveBeenCalledWith('test message')
})

test('alert', () => {
  const spy = jest.spyOn(window, 'alert').mockImplementation(() => {})
  Dialog.alert('test alert')
  expect(spy).toHaveBeenCalledWith('test alert')
})

// TODO html5 dialog is not supported in jsdom
test.skip('showErrorDialogWithOptions', () => {
  Dialog.showErrorDialogWithOptions('an error occurred', [
    'option 1',
    'option 2',
  ])
  expect(Dialog.state.$Dialog).toBeDefined()
  expect(Dialog.state.$Dialog.isConnected).toBe(true)
  expect(Dialog.state.$Dialog.innerHTML).toBe('')
})
