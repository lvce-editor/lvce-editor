import { expect, jest, test } from '@jest/globals'
import { openTextSearch } from '../src/parts/OpenTextSearch/OpenTextSearch.ts'

test('opens Search, applies the editor selection, and focuses the rendered input', async () => {
  const calls: string[] = []
  const state = { uid: 1 }
  const result = { commands: [['render']], newState: state }
  const openSideBarView = jest.fn<(currentState: typeof state, moduleId: string) => Promise<typeof result>>(async () => {
    calls.push('open')
    return result
  })
  const executeViewletCommand = jest.fn<(uid: number, command: string, ...args: readonly unknown[]) => Promise<void>>(async (_uid, command) => {
    calls.push(command)
  })

  const actual = await openTextSearch(state, {
    executeViewletCommand,
    getInstance: () => ({ state: { uid: 42 } }),
    getSelectionText: async () => 'abc',
    openSideBarView,
  })

  expect(openSideBarView).toHaveBeenCalledWith(state, 'Search')
  expect(executeViewletCommand).toHaveBeenCalledWith(42, 'handleInput', 'abc')
  expect(calls).toEqual(['open', 'handleInput'])
  expect(actual).toEqual({
    commands: [['render'], ['Viewlet.focusElementByName', 42, 'SearchValue']],
    newState: state,
  })
})

test('opens Search normally when no editor text is selected', async () => {
  const state = { uid: 1 }
  const result = { commands: [], newState: state }
  const openSideBarView = jest.fn<(currentState: typeof state, moduleId: string) => Promise<typeof result>>(async () => result)
  const executeViewletCommand = jest.fn<(uid: number, command: string, ...args: readonly unknown[]) => Promise<void>>(async () => {})

  const actual = await openTextSearch(state, {
    executeViewletCommand,
    getInstance: () => ({ state: { uid: 42 } }),
    getSelectionText: async () => '',
    openSideBarView,
  })

  expect(openSideBarView).toHaveBeenCalledWith(state, 'Search')
  expect(executeViewletCommand).not.toHaveBeenCalled()
  expect(actual.commands).toEqual([['Viewlet.focusElementByName', 42, 'SearchValue']])
})

test('does not apply input when Search failed to create an instance', async () => {
  const state = { uid: 1 }
  const result = { commands: [], newState: state }
  const executeViewletCommand = jest.fn<(uid: number, command: string, ...args: readonly unknown[]) => Promise<void>>(async () => {})

  await expect(
    openTextSearch(state, {
      executeViewletCommand,
      getInstance: () => undefined,
      getSelectionText: async () => 'abc',
      openSideBarView: async () => result,
    }),
  ).resolves.toBe(result)

  expect(executeViewletCommand).not.toHaveBeenCalled()
})
