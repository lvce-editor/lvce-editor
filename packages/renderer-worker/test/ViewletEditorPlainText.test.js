import { expect, test } from '@jest/globals'
import * as FileSystemState from '../src/parts/FileSystemState/FileSystemState.js'
import * as ViewletEditorPlainText from '../src/parts/ViewletEditorPlainText/ViewletEditorPlainText.js'
import * as ViewletManager from '../src/parts/ViewletManager/ViewletManager.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

const render = (oldState, newState) => {
  return ViewletManager.render(ViewletEditorPlainText, oldState, newState, ViewletModuleId.EditorPlainText)
}

test('create', () => {
  const state = ViewletEditorPlainText.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  FileSystemState.registerAll({
    test() {
      return {
        readFile(uri) {
          return 'test content'
        },
      }
    },
  })
  const state = ViewletEditorPlainText.create(0, 'test://sample-file', 0, 0, 0, 0)
  expect(await ViewletEditorPlainText.loadContent(state)).toEqual({
    content: 'test content',
    disposed: false,
    uri: 'test://sample-file',
  })
})

test('dispose', () => {
  const state = ViewletEditorPlainText.create()
  expect(ViewletEditorPlainText.dispose(state)).toMatchObject({
    disposed: true,
  })
})

test('render', () => {
  const oldState = ViewletEditorPlainText.create()
  const newState = {
    ...oldState,
    content: 'test',
  }
  expect(render(oldState, newState)).toEqual([['Viewlet.send', 'EditorPlainText', 'setContent', 'test']])
})
