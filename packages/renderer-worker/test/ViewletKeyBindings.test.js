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
    keyBindings: [
      {
        key: 'Enter',
        command: 'EditorCompletion.selectCurrent',
        when: 'focus.editorCompletions',
      },
    ],
  })
})
