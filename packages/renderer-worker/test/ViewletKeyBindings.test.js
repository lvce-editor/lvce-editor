import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/KeyBindingsInitial/KeyBindingsInitial.js',
  () => {
    return {
      getKeyBindings: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ViewletKeyBindings = await import(
  '../src/parts/ViewletKeyBindings/ViewletKeyBindings.js'
)
const KeyBindingsInitial = await import(
  '../src/parts/KeyBindingsInitial/KeyBindingsInitial.js'
)

test('create', () => {
  expect(ViewletKeyBindings.create()).toBeDefined()
})

test('loadContent', async () => {
  // @ts-ignore
  KeyBindingsInitial.getKeyBindings.mockImplementation(() => {
    return [
      {
        key: 'Enter',
        command: 'EditorCompletion.selectCurrent',
        when: 'focus.editorCompletions',
      },
    ]
  })
  const state = ViewletKeyBindings.create()
  expect(await ViewletKeyBindings.loadContent(state)).toMatchObject({
    parsedKeyBindings: [
      {
        rawKey: 'Enter',
        isCtrl: false,
        isShift: false,
        key: 'Enter',
        command: 'EditorCompletion.selectCurrent',
        when: 'focus.editorCompletions',
      },
    ],
  })
})

test('handleInput - filter key bindings', async () => {
  const state = {
    ...ViewletKeyBindings.create(),
    parsedKeyBindings: [
      {
        rawKey: 'Enter',
        isCtrl: false,
        isShift: false,
        key: 'Enter',
        command: 'EditorCompletion.selectCurrent',
        when: 'focus.editorCompletions',
      },
      {
        rawKey: 'Enter',
        isCtrl: false,
        isShift: false,
        key: 'Enter',
        command: 'abc',
        when: 'focus.editorCompletions',
      },
    ],
  }
  expect(ViewletKeyBindings.handleInput(state, 'abc')).toMatchObject({
    value: 'abc',
    filteredKeyBindings: [
      {
        key: 'Enter',
        command: 'abc',
        when: 'focus.editorCompletions',
      },
    ],
  })
})

test('setDeltaY - scroll up - already at top', () => {
  const state = {
    ...ViewletKeyBindings.create(),
    parsedKeyBindings: [
      {
        rawKey: 'Enter',
        isCtrl: false,
        isShift: false,
        key: 'Enter',
        command: 'EditorCompletion.selectCurrent',
        when: 'focus.editorCompletions',
      },
    ],
    minLineY: 0,
    maxLineY: 1,
    maxVisibleItems: 1,
  }
  expect(ViewletKeyBindings.setDeltaY(state, 0)).toMatchObject({
    minLineY: 0,
    maxLineY: 1,
  })
})

test('setDeltaY - scroll up - by one row', () => {
  const state = {
    ...ViewletKeyBindings.create(),
    filteredKeyBindings: [
      {
        rawKey: 'Enter',
        isCtrl: false,
        isShift: false,
        key: 'Enter',
        command: 'EditorCompletion.selectCurrent',
        when: 'focus.editorCompletions',
      },
      {
        rawKey: 'Enter',
        isCtrl: false,
        isShift: false,
        key: 'Enter',
        command: 'EditorCompletion.selectCurrent',
        when: 'focus.editorCompletions',
      },
    ],
    minLineY: 1,
    maxLineY: 2,
    maxVisibleItems: 1,
  }
  expect(ViewletKeyBindings.setDeltaY(state, 0)).toMatchObject({
    minLineY: 0,
    maxLineY: 1,
  })
})

test('setDeltaY - scroll up - by two rows', () => {
  const state = {
    ...ViewletKeyBindings.create(),
    filteredKeyBindings: [
      {
        rawKey: 'Enter',
        isCtrl: false,
        isShift: false,
        key: 'Enter',
        command: 'EditorCompletion.selectCurrent',
        when: 'focus.editorCompletions',
      },
      {
        rawKey: 'Enter',
        isCtrl: false,
        isShift: false,
        key: 'Enter',
        command: 'EditorCompletion.selectCurrent',
        when: 'focus.editorCompletions',
      },
      {
        rawKey: 'Enter',
        isCtrl: false,
        isShift: false,
        key: 'Enter',
        command: 'EditorCompletion.selectCurrent',
        when: 'focus.editorCompletions',
      },
    ],
    minLineY: 2,
    maxLineY: 3,
    maxVisibleItems: 1,
  }
  expect(ViewletKeyBindings.setDeltaY(state, 0)).toMatchObject({
    minLineY: 0,
    maxLineY: 1,
  })
})
