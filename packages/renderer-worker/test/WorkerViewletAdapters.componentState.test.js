import { beforeEach, expect, jest, test } from '@jest/globals'
import * as WorkerViewletAdapters from '../src/parts/WorkerViewletAdapters/WorkerViewletAdapters.js'

const invoke = jest.fn(async (..._args) => /** @type {unknown} */ (undefined))
const adapter = /** @type {any} */ (WorkerViewletAdapters.componentState.extendModule(undefined, { worker: { invoke } }))

beforeEach(() => {
  jest.resetAllMocks()
})

test('gets the component state view state for the matching uid', async () => {
  const state = { uid: 7, components: [] }
  invoke.mockResolvedValue(state)

  await expect(adapter.getComponentState({ uid: 7 })).resolves.toBe(state)
  expect(invoke).toHaveBeenCalledWith('ComponentState.getViewState', 7)
})

test('sets the component state view state and returns its current value', async () => {
  const state = { uid: 7, components: [] }
  invoke.mockResolvedValueOnce(undefined).mockResolvedValueOnce(state)

  await expect(adapter.setComponentState({ uid: 7 }, state)).resolves.toBe(state)
  expect(invoke.mock.calls).toEqual([
    ['ComponentState.setViewState', 7, state],
    ['ComponentState.getViewState', 7],
  ])
})
