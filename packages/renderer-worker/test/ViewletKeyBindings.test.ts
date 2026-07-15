import { beforeEach, expect, jest, test } from '@jest/globals'
import * as KeyCode from '../src/parts/KeyCode/KeyCode.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/KeyBindingsInitial/KeyBindingsInitial.js', () => {
  return {
    getKeyBindings: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletKeyBindings = await import('../src/parts/ViewletKeyBindings/ViewletKeyBindings.js')
const KeyBindingsInitial = await import('../src/parts/KeyBindingsInitial/KeyBindingsInitial.js')

test('create', () => {
  expect(ViewletKeyBindings.create()).toBeDefined()
})

test.skip('loadContent', async () => {
  // @ts-ignore
  KeyBindingsInitial.getKeyBindings.mockImplementation(() => {
    return [
      {
        key: KeyCode.Enter,
        command: 'EditorCompletion.selectCurrent',
        when: 'focus.editorCompletions',
      },
    ]
  })
  const state = { ...ViewletKeyBindings.create(), width: 0 }
  expect(await ViewletKeyBindings.loadContent(state)).toMatchObject({
    parsedKeyBindings: [
      {
        rawKey: KeyCode.Enter,
        isCtrl: false,
        isShift: false,
        key: 'Enter',
        command: 'EditorCompletion.selectCurrent',
        when: 'focus.editorCompletions',
      },
    ],
  })
})
