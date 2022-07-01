import * as ViewletEditorText from '../src/parts/Viewlet/ViewletEditorText.js'

test('resize - increase height', () => {
  const state = {
    ...ViewletEditorText.create(0, '', 0, 0, 20, 20),
    lines: ['line 1', 'line 2', 'line 3', 'line 4', 'line 5'],
    minLineY: 0,
    maxLineY: 1,
    numberOfVisibleLines: 1,
  }
  const { newState, commands } = ViewletEditorText.resize(state, {
    top: 200,
    left: 200,
    width: 200,
    height: 60,
  })
  console.log(newState)
  expect(newState).toEqual(
    expect.objectContaining({
      minLineY: 0,
      maxLineY: 3,
      numberOfVisibleLines: 3,
      scrollBarHeight: 0,
      finalDeltaY: 40,
    })
  )
  expect(commands).toEqual([
    [
      'Viewlet.send',
      'EditorText',
      'renderTextAndCursorsAndSelections',
      0,
      0,
      [
        ['line 1', 'Token Text'],
        ['line 2', 'Token Text'],
        ['line 3', 'Token Text'],
      ],
      [],
      [],
    ],
  ])
})

test('resize - same height', () => {
  const state = {
    ...ViewletEditorText.create(0, '', 0, 0, 20, 20),
    lines: ['line 1', 'line 2', 'line 3', 'line 4', 'line 5'],
    minLineY: 0,
    maxLineY: 3,
    numberOfVisibleLines: 3,
  }
  const { newState, commands } = ViewletEditorText.resize(state, {
    top: 200,
    left: 200,
    width: 200,
    height: 60,
  })
  expect(newState).toEqual(
    expect.objectContaining({
      minLineY: 0,
      maxLineY: 3,
      numberOfVisibleLines: 3,
      scrollBarHeight: 0,
      finalDeltaY: 40,
    })
  )
  expect(commands).toEqual([
    [
      'Viewlet.send',
      'EditorText',
      'renderTextAndCursorsAndSelections',
      0,
      0,
      [
        ['line 1', 'Token Text'],
        ['line 2', 'Token Text'],
        ['line 3', 'Token Text'],
      ],
      [],
      [],
    ],
  ])
})

test('resize - reduce height', () => {
  const state = {
    ...ViewletEditorText.create(0, '', 0, 0, 20, 20),
    lines: ['line 1', 'line 2', 'line 3', 'line 4', 'line 5'],
    minLineY: 0,
    maxLineY: 3,
    numberOfVisibleLines: 3,
    height: 60,
  }
  const { newState, commands } = ViewletEditorText.resize(state, {
    top: 200,
    left: 200,
    width: 200,
    height: 20,
  })
  expect(newState).toEqual(
    expect.objectContaining({
      minLineY: 0,
      maxLineY: 1,
      numberOfVisibleLines: 1,
      scrollBarHeight: 0,
      finalDeltaY: 80,
    })
  )
  expect(commands).toEqual([
    [
      'Viewlet.send',
      'EditorText',
      'renderTextAndCursorsAndSelections',
      0,
      0,
      [['line 1', 'Token Text']],
      [],
      [],
    ],
  ])
})
