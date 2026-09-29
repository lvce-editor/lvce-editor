import { beforeEach, expect, jest, test } from '@jest/globals'

const executeViewletCommand = jest.fn<(...args: unknown[]) => Promise<void>>()
const handleFocusChange = jest.fn<(id: string, isFocused: boolean) => unknown[]>(() => [])

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ executeViewletCommand, handleFocusChange }))

const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')
const ApplicationRegistry = await import('../src/parts/ApplicationRegistry/ApplicationRegistry.ts')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')

beforeEach(() => {
  ViewletStates.reset()
  for (const id of ['first', 'second', 'other', 'current']) {
    ApplicationRegistry.remove(id)
  }
  jest.clearAllMocks()
})

const addTitleBar = (uid: number, applicationId: string) => {
  ApplicationRegistry.create({ id: applicationId, layoutUid: uid + 100, workspacePath: '', workspaceUri: '', href: '' })
  const state = { uid, applicationId }
  ViewletStates.set(uid, { factory: {}, moduleId: 'TitleBar', renderedState: state, state })
}

test('application blur closes its title bar menu without retaining focus', async () => {
  addTitleBar(77, 'first')
  addTitleBar(88, 'second')
  const state = { ...ViewletLayout.create(1), applicationId: 'second', focused: true }

  const result = await ViewletLayout.handleBlur(state)

  expect(executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(executeViewletCommand).toHaveBeenCalledWith(88, 'closeMenu', false)
  expect(result.newState.focused).toBe(false)
  expect(handleFocusChange).toHaveBeenCalledWith('TitleBar', false)
})

test('application blur works without a loaded title bar', async () => {
  addTitleBar(77, 'other')
  const state = { ...ViewletLayout.create(1), applicationId: 'current', focused: true }

  const result = await ViewletLayout.handleBlur(state)

  expect(executeViewletCommand).not.toHaveBeenCalled()
  expect(result.newState.focused).toBe(false)
})

test('application focus does not close the title bar menu', () => {
  addTitleBar(77, 'current')
  const state = { ...ViewletLayout.create(1), applicationId: 'current', focused: false }

  const result = ViewletLayout.handleFocus(state)

  expect(executeViewletCommand).not.toHaveBeenCalled()
  expect(result.newState.focused).toBe(true)
})
