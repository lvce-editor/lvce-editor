import * as ViewletInputBox from '../src/parts/ViewletInputBox/ViewletInputBox.js'

test('render - value changes', () => {
  const oldState = {
    ...ViewletInputBox.create({ handleInput() {} }),
    value: 'a',
  }
  const newState = { ...oldState, value: 'b' }
  expect(ViewletInputBox.render(oldState, newState)).toEqual([
    ['Viewlet.send', 'Input', 'setValue', 'b'],
  ])
})

test('render - selectionStart changes', () => {
  const oldState = {
    ...ViewletInputBox.create({ handleInput() {} }),
    selectionStart: 0,
  }
  const newState = { ...oldState, selectionStart: 1 }
  expect(ViewletInputBox.render(oldState, newState)).toEqual([
    ['Viewlet.send', 'Input', 'setSelection', 1, 0],
  ])
})
