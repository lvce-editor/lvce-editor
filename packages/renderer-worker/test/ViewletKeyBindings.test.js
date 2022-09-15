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

test('name', () => {
  expect(ViewletKeyBindings.name).toBe('KeyBindings')
})

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
