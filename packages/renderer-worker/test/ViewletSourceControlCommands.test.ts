import { beforeEach, expect, jest, test } from '@jest/globals'

const sourceControlWorkerInvoke = jest.fn()

jest.unstable_mockModule('../src/parts/SourceControlWorker/SourceControlWorker.js', () => ({
  invoke: sourceControlWorkerInvoke,
}))

const ViewletSourceControlCommands = await import('../src/parts/ViewletSourceControl/ViewletSourceControlCommands.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('renders pending source control worker state without replaying a command', async () => {
  const state = {
    badgeCount: 2,
    commands: [],
    uid: 42,
  }
  sourceControlWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'SourceControl.diff2':
        return [1]
      case 'SourceControl.render2':
        return [['Viewlet.setDom2', 42, ['div']]]
      case 'SourceControl.getBadgeCount':
        return 2
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })

  const result = await ViewletSourceControlCommands.Commands.__renderPending(state)

  expect(Object.keys(ViewletSourceControlCommands.Commands)).not.toContain('__renderPending')
  expect(sourceControlWorkerInvoke.mock.calls).toEqual([
    ['SourceControl.diff2', 42],
    ['SourceControl.render2', 42, [1]],
    ['SourceControl.getBadgeCount', 42, [1]],
  ])
  expect(result).toEqual({
    ...state,
    commands: [['Viewlet.setDom2', 42, ['div']]],
  })
})
