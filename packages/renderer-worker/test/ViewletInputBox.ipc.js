import * as ViewletInputBox from '../src/parts/ViewletInputBox/ViewletInputBox.js'

test('render - value changes', () => {
  const handleInput = () => {}
  const oldState = { ...ViewletInputBox.create({ handleInput }), value: 'a' }
  const newState = { ...oldState, value: 'b' }
  expect(ViewletInputBox.render(oldState, newState)).toEqual([
    ['Viewlet.send', 'Input', 'setValue', 'b'],
  ])
})
