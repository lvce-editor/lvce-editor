import { expect, test } from '@jest/globals'
import * as WorkerViewletAdapters from '../src/parts/WorkerViewletAdapters/WorkerViewletAdapters.js'

const adapter = WorkerViewletAdapters.textSearch.extendModule(undefined, { wrapCommand: (command) => command })

test('exposes the text search viewlet focus command', () => {
  const commands = {}

  WorkerViewletAdapters.textSearch.extendCommands(commands, { focus: 'focus' })

  expect(commands.focus).toBe('focus')
})

test('focuses the search input in a search editor', () => {
  const state = { commands: [], isSearchEditor: true }

  expect(adapter.focus(state)).toEqual({
    commands: [['Viewlet.focusSelector', '[name="SearchValue"]']],
    isSearchEditor: true,
  })
})

test('does not change focus in the search sidebar', () => {
  const state = { commands: [], isSearchEditor: false }

  expect(adapter.focus(state)).toBe(state)
})
