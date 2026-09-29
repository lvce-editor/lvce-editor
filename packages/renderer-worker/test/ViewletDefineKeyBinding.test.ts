import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => {
  return {
    disposeWidgetWithValue: jest.fn(),
  }
})

const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
const ViewletDefineKeyBinding = await import('../src/parts/ViewletDefineKeyBinding/ViewletDefineKeyBinding.js')

test('create - stores the parent keybindings view uid', () => {
  expect(ViewletDefineKeyBinding.create(42, '', 0, 0, 100, 100, [7])).toMatchObject({
    id: 42,
    parentUid: 7,
  })
})

test('handleKeyDown - Enter waits for the recorded keybinding to be submitted', async () => {
  const state = {
    uid: 42,
    value: 'Ctrl+Alt+9',
  }
  let resolveDispose = () => {}
  const disposePromise = new Promise<undefined>((resolve) => {
    resolveDispose = () => resolve(undefined)
  })
  jest.mocked(Viewlet.disposeWidgetWithValue).mockReturnValue(disposePromise)

  let completed = false
  const resultPromise = ViewletDefineKeyBinding.handleKeyDown(state, 'Enter', false, false, false, false).then((result) => {
    completed = true
    return result
  })

  expect(Viewlet.disposeWidgetWithValue).toHaveBeenCalledWith(42, 'Ctrl+Alt+9')
  expect(completed).toBe(false)

  resolveDispose()

  await expect(resultPromise).resolves.toBe(state)
  expect(completed).toBe(true)
})
