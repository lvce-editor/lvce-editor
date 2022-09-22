/**
 * @jest-environment jsdom
 */
import * as Editor from '../src/parts/Editor/Editor.js'
import * as EditorHelper from '../src/parts/Editor/EditorHelper.js'
import * as Platform from '../src/parts/Platform/Platform.js'

afterEach(() => {
  Platform.state.cachedIsMobileOrTablet = undefined
})

const create$EditorRow = () => {
  const $EditorRow = document.createElement('div')
  $EditorRow.className = 'EditorRow'
  return $EditorRow
}

const create$Token = (text, className) => {
  const $Token = document.createElement('span')
  $Token.className = className
  $Token.textContent = text
  return $Token
}

test('create', () => {
  const state = Editor.create()
  expect(state).toBeDefined()
})

test.skip('focus', () => {
  const state = Editor.create()
  EditorHelper.setState(1, state)
  document.body.append(state.$Editor)
  Editor.focus(state)
  expect(state.$EditorInput).toBe(document.activeElement)
})

test('dispose', () => {
  // TODO
  const state = Editor.create()
  EditorHelper.setState(1, state)
})

// TODO
test.skip('accessibility - textarea should have selection set', async () => {
  // @ts-ignore
  globalThis.requestIdleCallback = (fn) => {
    // @ts-ignore
    fn()
  }
  // @ts-ignore
  const state = Editor.create(1, '/tmp/file1')
  // @ts-ignore
  Editor.setTextDocument(state, {
    lines: [
      'line 1',
      'line 2',
      'line 3',
      'line 4',
      'line 5',
      'line 6',
      'line 7',
      'line 8',
      'line 9',
      'line 10',
      'line 11',
      'line 12',
      'line 13',
      'line 14',
      'line 15',
      'line 16',
      'line 17',
      'line 18',
      'line 19',
      'line 20',
    ],
  })
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  // @ts-ignore
  Editor.setCursors(state, { rowIndex: 5, columnIndex: 5 })
  expect(state.$EditorInput.value).toBe(`line 1
line 2
line 3
line 4
line 5
line 6
line 7
line 8
line 9
line 10`)
  expect(state.$EditorInput.selectionStart).toBe(40)
  expect(state.$EditorInput.selectionEnd).toBe(40)
  // @ts-ignore
  Editor.setCursors(state, { rowIndex: 15, columnIndex: 5 })
  expect(state.$EditorInput.value).toBe(`line 11
line 12
line 13
line 14
line 15
line 16
line 17
line 18
line 19
line 20`)
  expect(state.$EditorInput.selectionStart).toBe(45)
  expect(state.$EditorInput.selectionEnd).toBe(45)
})

test('accessibility - Editor should have role code', async () => {
  const state = Editor.create()
  // @ts-ignore
  expect(state.$Editor.role).toBe('code')
})

test.skip('renderTextAndCursorsAndSelections - beforeinput on contenteditable on mobile - cursor in middle - native', () => {
  Platform.state.isMobileOrTablet = () => true
  const state = Editor.create()
  EditorHelper.setState(1, state)
  const $Token1 = create$Token('  ', 'Whitespace')
  const $Token2 = create$Token('background', 'CssPropertyName')
  const $Token3 = create$Token(':', 'Punctuation')
  const $Token4 = create$Token(' ', 'Whitespace')
  const $Row1 = create$EditorRow()
  $Row1.append($Token1, $Token2, $Token3, $Token4)
  state.$LayerText.append($Row1)
  document.body.append(state.$Editor)
  const range = document.createRange()
  range.setStart($Token2.firstChild, 4)
  document.getSelection().removeAllRanges()
  document.getSelection().addRange(range)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  Editor.renderTextAndCursorsAndSelections(
    state,
    0,
    0,
    [
      [
        '  ',
        'Whitespace',
        'back ground',
        'CssPropertyName',
        ':',
        'Punctuation',
        ' ',
        'Whitespace',
      ],
    ],
    [{ rowIndex: 0, columnIndex: 7 }],
    []
  )
  expect(document.getSelection().anchorNode).toBe($Row1.children[1].firstChild)
  expect(document.getSelection().anchorOffset).toBe(5)
  expect(document.getSelection().focusNode).toBe($Row1.children[1].firstChild)
  expect(document.getSelection().focusOffset).toBe(5)
})

test.skip('renderTextAndCursorsAndSelections - native selection - word in middle selected', () => {
  Platform.state.isMobileOrTablet = () => true
  const state = Editor.create()
  EditorHelper.setState(1, state)
  const $Token1 = create$Token('  ', 'Whitespace')
  const $Token2 = create$Token('background', 'CssPropertyName')
  const $Token3 = create$Token(':', 'Punctuation')
  const $Token4 = create$Token(' ', 'Whitespace')
  const $Row1 = create$EditorRow()
  $Row1.append($Token1, $Token2, $Token3, $Token4)
  state.$LayerText.append($Row1)
  document.body.append(state.$Editor)
  const range = document.createRange()
  range.setStart($Token2.firstChild, 0)
  range.setEnd($Token2.firstChild, 10)
  document.getSelection().removeAllRanges()
  document.getSelection().addRange(range)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  Editor.renderTextAndCursorsAndSelections(
    state,
    0,
    0,
    [
      [
        '  ',
        'Whitespace',
        'a',
        'CssPropertyName',
        ':',
        'Punctuation',
        ' ',
        'Whitespace',
      ],
    ],
    [
      {
        rowIndex: 0,
        columnIndex: 3,
      },
    ],
    []
  )
  expect(document.getSelection().anchorNode).toBe($Row1.children[1].firstChild)
  expect(document.getSelection().anchorOffset).toBe(1)
  expect(document.getSelection().focusNode).toBe($Row1.children[1].firstChild)
  expect(document.getSelection().focusOffset).toBe(1)
})

test.skip('renderTextAndCursorsAndSelections - bug with multiple tokens', () => {
  Platform.state.isMobileOrTablet = () => true
  const state = Editor.create()
  EditorHelper.setState(1, state)
  const $Token1 = create$Token('  ', 'Whitespace')
  const $Token2 = create$Token('background', 'CssPropertyName')
  const $Token3 = create$Token(' ', 'Whitespace')
  const $Token4 = create$Token(':', 'Punctuation')
  const $Token5 = create$Token(' ', 'Whitespace')
  const $Row1 = create$EditorRow()
  $Row1.append($Token1, $Token2, $Token3, $Token4, $Token5)
  state.$LayerText.append($Row1)
  document.body.append(state.$Editor)
  const range = document.createRange()
  range.setStart($Token3.firstChild, 1)
  range.setEnd($Token3.firstChild, 1)
  document.getSelection().removeAllRanges()
  document.getSelection().addRange(range)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  Editor.renderTextAndCursorsAndSelections(
    state,
    0,
    0,
    [
      [
        '  ',
        'Whitespace',
        'background',
        'CssPropertyName',
        ' ',
        'Whitespace',
        'a: ',
        'Unknown',
      ],
    ],
    [
      {
        rowIndex: 0,
        columnIndex: 14,
      },
    ],
    []
  )
  expect(document.getSelection().anchorNode).toBe($Row1.children[3].firstChild)
  expect(document.getSelection().anchorOffset).toBe(1)
  expect(document.getSelection().focusNode).toBe($Row1.children[3].firstChild)
  expect(document.getSelection().focusOffset).toBe(1)
})
