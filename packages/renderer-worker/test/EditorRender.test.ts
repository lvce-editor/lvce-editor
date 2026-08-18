import { expect, test } from '@jest/globals'
import * as Editor from '../src/parts/Editor/Editor.js'

test('preserves canvas commands emitted by the editor worker', () => {
  const command = ['Viewlet.renderCanvas', 42, '.EditorMinimap', 'EditorMinimapCanvas', 120, 600, [], '1:0']
  const newState = {
    commands: [command],
    uid: 42,
  }

  const result = Editor.render[0].apply({}, newState)

  expect(result).toEqual([command])
  expect(newState.commands).toEqual([])
})
