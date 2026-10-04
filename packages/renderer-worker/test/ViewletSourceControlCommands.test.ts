import { beforeEach, expect, jest, test } from '@jest/globals'

const sourceControlWorkerInvoke = jest.fn()
const execute = jest.fn()
const applicationExecute = jest.fn()

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({ execute }))
jest.unstable_mockModule('../src/parts/Application/Application.ts', () => ({ execute: applicationExecute }))
jest.unstable_mockModule('../src/parts/ApplicationRegistry/ApplicationRegistry.ts', () => ({
  get: (id: string) => ({ workspaceUri: `memfs:///${id}` }),
}))

jest.unstable_mockModule('../src/parts/SourceControlWorker/SourceControlWorker.js', () => ({
  invoke: sourceControlWorkerInvoke,
}))

const ViewletSourceControlCommands = await import('../src/parts/ViewletSourceControl/ViewletSourceControlCommands.js')
const ViewletSourceControl = await import('../src/parts/ViewletSourceControl/ViewletSourceControl.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('disposes only the owned source control worker state', async () => {
  const state = { uid: 42, disposed: false }
  expect(await ViewletSourceControl.dispose(state)).toEqual({ ...state, disposed: true })
  expect(sourceControlWorkerInvoke.mock.calls).toEqual([['SourceControl.dispose', 42]])
  expect(state.disposed).toBe(false)
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
      case 'SourceControl.renderActions':
        return ['actions']
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })

  const result = await ViewletSourceControlCommands.Commands.__renderPending(state)

  expect(Object.keys(ViewletSourceControlCommands.Commands)).not.toContain('__renderPending')
  expect(sourceControlWorkerInvoke.mock.calls).toEqual([
    ['SourceControl.diff2', 42],
    ['SourceControl.renderActions', 42],
    ['SourceControl.render2', 42, [1]],
    ['SourceControl.getBadgeCount', 42, [1]],
  ])
  expect(result).toEqual({
    ...state,
    actionsDom: ['actions'],
    commands: [['Viewlet.setDom2', 42, ['div']]],
  })
})

test('refreshes source control title actions when component state does not change', async () => {
  const state = {
    actionsDom: ['view-as-tree'],
    commands: [['stale-render-command']],
    uid: 42,
  }
  sourceControlWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'SourceControl.diff2':
        return []
      case 'SourceControl.renderActions':
        return ['view-as-list']
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })

  const result = await ViewletSourceControlCommands.Commands.__renderPending(state)

  expect(result).toEqual({ ...state, actionsDom: ['view-as-list'], commands: [] })
  expect(sourceControlWorkerInvoke.mock.calls).toEqual([
    ['SourceControl.diff2', 42],
    ['SourceControl.renderActions', 42],
  ])
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
      case 'SourceControl.renderActions':
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
    ['SourceControl.renderActions', 42],
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
      case 'SourceControl.renderActions':
        return ['actions']
      case 'SourceControl.setComponentState':
        return undefined
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })

  await expect(ViewletSourceControl.getComponentState(rendererState)).resolves.toBe(componentState)
  await expect(ViewletSourceControl.setComponentState(rendererState, componentState)).resolves.toEqual({
    ...rendererState,
    actionsDom: ['actions'],
    commands: [['Viewlet.setDom2', 42, ['div']]],
  })
})

test('retains the parent view for source control toolbar updates', () => {
  const state = ViewletSourceControl.create(42, '', 0, 0, 200, 300, undefined, 7)
  expect(state.parentUid).toBe(7)
})

test.each([undefined, 'application-a'])('commits every workspace refresh render for %s', async (applicationId) => {
  const state = { uid: 42, applicationId, platform: 1, assetDir: '/assets' }
  let transactionId = 0
  sourceControlWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'SourceControl.create2':
      case 'SourceControl.loadContent':
        return undefined
      case 'SourceControl.diff2':
        return [11, 10]
      case 'SourceControl.render2':
        return [['Viewlet.commitPending', 42, ++transactionId]]
      case 'SourceControl.renderActions':
        return []
      case 'SourceControl.getBadgeCount':
        return 0
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })

  const result = await ViewletSourceControl.handleWorkspaceChange(state)

  // Leaving the loading transaction uncommitted blocks all later renders for this view.
  expect(result.commands).toEqual([
    ['Viewlet.commitPending', 42, 1],
    ['Viewlet.commitPending', 42, 2],
  ])
  if (applicationId) {
    expect(sourceControlWorkerInvoke.mock.calls[0][7]).toBe('memfs:///application-a')
    expect(applicationExecute).toHaveBeenCalledWith(applicationId, 'Layout.setBadgeCount', 'Source Control', 0)
    expect(execute).not.toHaveBeenCalled()
  } else {
    expect(execute).toHaveBeenCalledWith('Layout.setBadgeCount', 'Source Control', 0)
    expect(applicationExecute).not.toHaveBeenCalled()
  }
})
