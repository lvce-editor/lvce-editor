import { beforeEach, expect, jest, test } from '@jest/globals'

const { wrapExplorerCommandWithDependencies } = await import('../src/parts/WrapExplorerCommand/WrapExplorerCommand.ts')

const getTitle = jest.fn<(uid: number) => Promise<string>>()
const invoke = jest.fn<(command: string, ...args: readonly unknown[]) => Promise<unknown>>()

beforeEach(() => {
  jest.resetAllMocks()
})

test('updates explorer actions when the workspace changes without a content diff', async () => {
  const actionsDom = [['newFile'], ['newFolder'], ['refresh'], ['collapseAll']]
  invoke.mockImplementation(async (command: string) => {
    if (command === 'Explorer.diff2') {
      return []
    }
    if (command === 'Explorer.renderActions2') {
      return actionsDom
    }
    return undefined
  })
  getTitle.mockResolvedValue('workspace')
  const state = {
    actionsDom: [['refresh'], ['collapseAll']],
    commands: [],
    title: 'workspace',
    uid: 7,
  }

  const result = await wrapExplorerCommandWithDependencies('handleWorkspaceChange', { getTitle, invoke })(state, '/workspace')

  expect(result).toEqual({
    ...state,
    actionsDom,
  })
  expect(invoke).toHaveBeenNthCalledWith(1, 'Explorer.handleWorkspaceChange', 7, '/workspace')
  expect(invoke).toHaveBeenNthCalledWith(2, 'Explorer.diff2', 7)
  expect(getTitle).toHaveBeenCalledWith(7)
  expect(invoke).toHaveBeenNthCalledWith(3, 'Explorer.renderActions2', 7)
})

test('returns the existing state when explorer actions, title, and content are unchanged', async () => {
  const actionsDom = [['refresh'], ['collapseAll']]
  invoke.mockImplementation(async (command: string) => {
    if (command === 'Explorer.diff2') {
      return []
    }
    if (command === 'Explorer.renderActions2') {
      return actionsDom
    }
    return undefined
  })
  getTitle.mockResolvedValue('workspace')
  const state = {
    actionsDom,
    commands: [],
    title: 'workspace',
    uid: 7,
  }

  const result = await wrapExplorerCommandWithDependencies('refresh', { getTitle, invoke })(state)

  expect(result).toBe(state)
})
