import { beforeEach, expect, jest, test } from '@jest/globals'

const sourceControlWorkerInvoke = jest.fn()

jest.unstable_mockModule('../src/parts/SourceControlWorker/SourceControlWorker.js', () => ({
  invoke: sourceControlWorkerInvoke,
}))

const ViewletSourceControlCommands = await import('../src/parts/ViewletSourceControl/ViewletSourceControlCommands.js')
const ViewletSourceControl = await import('../src/parts/ViewletSourceControl/ViewletSourceControl.js')

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

test('reloads source control contributions when extensions change', async () => {
  const state = {
    actionsDom: ['old-actions'],
    badgeCount: 3,
    commands: [],
    savedState: {
      inputValue: 'message',
    },
    uid: 42,
  }
  sourceControlWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'SourceControl.loadContent':
        return undefined
      case 'SourceControl.diff2':
        return [1]
      case 'SourceControl.render2':
        return [['Viewlet.setDom2', 42, ['div']]]
      case 'SourceControl.renderActions2':
        return ['new-actions']
      case 'SourceControl.getBadgeCount':
        return 0
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })

  const result = await ViewletSourceControl.handleExtensionsChanged(state)

  expect(sourceControlWorkerInvoke.mock.calls).toEqual([
    ['SourceControl.loadContent', 42, { inputValue: 'message' }],
    ['SourceControl.diff2', 42],
    ['SourceControl.render2', 42, [1]],
    ['SourceControl.renderActions2', 42],
    ['SourceControl.getBadgeCount', 42],
  ])
  expect(result).toEqual({
    ...state,
    actionsDom: ['new-actions'],
    badgeCount: 0,
    commands: [['Viewlet.setDom2', 42, ['div']]],
  })
})

test('registers the extension contribution refresh command', async () => {
  sourceControlWorkerInvoke.mockImplementation(() => [])

  const commands = await ViewletSourceControlCommands.getCommands()

  expect(commands.handleExtensionsChanged).toBe(ViewletSourceControl.handleExtensionsChanged)
})

test('gets and sets authoritative source control component state', async () => {
  const rendererState = {
    badgeCount: 0,
    commands: [],
    uid: 42,
  }
  const componentState = { id: 42, inputValue: 'message' }
  sourceControlWorkerInvoke.mockImplementation((method): unknown => {
    switch (method) {
      case 'SourceControl.diff2':
        return [1]
      case 'SourceControl.getBadgeCount':
        return 0
      case 'SourceControl.getComponentState':
        return componentState
      case 'SourceControl.render2':
        return [['Viewlet.setDom2', 42, ['div']]]
      case 'SourceControl.setComponentState':
        return undefined
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })

  await expect(ViewletSourceControl.getComponentState(rendererState)).resolves.toBe(componentState)
  await expect(ViewletSourceControl.setComponentState(rendererState, componentState)).resolves.toEqual({
    ...rendererState,
    commands: [['Viewlet.setDom2', 42, ['div']]],
  })
})
