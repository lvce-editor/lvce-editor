import { beforeEach, expect, jest, test } from '@jest/globals'

const hydratePreferences = jest.fn()
const extensionManagementInvoke = jest.fn<(method: string, ...params: readonly unknown[]) => Promise<unknown>>(async () => undefined)
const problemsInvoke = jest.fn<(method: string, ...params: readonly unknown[]) => Promise<unknown>>(async () => ({
  errorCount: 0,
  hasEditor: false,
  problemCount: 0,
  warningCount: 0,
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => {
  return {
    get: jest.fn(),
    hydrate: hydratePreferences,
    update: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => {
  return {
    invoke: extensionManagementInvoke,
  }
})

jest.unstable_mockModule('../src/parts/ProblemsWorker/ProblemsWorker.ts', () => {
  return {
    invoke: problemsInvoke,
  }
})

jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => {
  return {
    render: jest.fn((factory, renderedState, newState) => {
      // @ts-ignore
      return [[`render.${newState.uid}`]]
    }),
  }
})

const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')

beforeEach(() => {
  ViewletStates.reset()
  jest.clearAllMocks()
})

const createDeferred = () => {
  let resolve = () => {}
  const promise = new Promise((resolvePromise) => {
    resolve = () => resolvePromise(undefined)
  })
  return {
    promise,
    resolve,
  }
}

const createInstance = (uid, eventName, handler) => {
  const state = {
    uid,
  }
  return {
    factory: {
      Commands: {
        [eventName]: handler,
      },
    },
    moduleId: `Test${uid}`,
    renderedState: state,
    state,
  }
}

test('handleWorkspaceRefresh runs global event handlers in parallel', async () => {
  const calls: string[] = []
  const workspaceChanges = {
    deleted: ['/workspace/deleted.ts'],
  }
  const first = createDeferred()
  const second = createDeferred()
  ViewletStates.set(
    'first',
    createInstance(1, 'handleWorkspaceRefresh', async (state, receivedWorkspaceChanges) => {
      calls.push('first:start')
      expect(receivedWorkspaceChanges).toBe(workspaceChanges)
      await first.promise
      calls.push('first:end')
      return {
        ...state,
        refreshed: true,
      }
    }),
  )
  ViewletStates.set(
    'second',
    createInstance(2, 'handleWorkspaceRefresh', async (state, receivedWorkspaceChanges) => {
      calls.push('second:start')
      expect(receivedWorkspaceChanges).toBe(workspaceChanges)
      await second.promise
      calls.push('second:end')
      return {
        ...state,
        refreshed: true,
      }
    }),
  )

  const state = ViewletLayout.create(1)
  const resultPromise = ViewletLayout.handleWorkspaceRefresh(state, workspaceChanges)

  expect(calls).toEqual(['first:start', 'second:start'])

  second.resolve()
  await Promise.resolve()
  expect(calls).toEqual(['first:start', 'second:start', 'second:end'])

  first.resolve()
  const result = await resultPromise

  expect(calls).toEqual(['first:start', 'second:start', 'second:end', 'first:end'])
  expect(extensionManagementInvoke).toHaveBeenCalledWith('Extensions.handleFileChanges', workspaceChanges)
  expect(ViewletManager.render).toHaveBeenCalledTimes(2)
  expect(result).toEqual({
    commands: [['render.1'], ['render.2']],
    newState: {
      ...state,
    },
  })
})

test('handleColorThemeChanged forwards the color theme id to viewlets', async () => {
  const handler = jest.fn((state: { uid: number }, colorThemeId: string) => {
    return {
      ...state,
      colorThemeId,
    }
  })
  ViewletStates.set('extension-detail', createInstance(1, 'handleColorThemeChanged', handler))

  const state = ViewletLayout.create(1)
  const result = await ViewletLayout.handleColorThemeChanged(state, 'slime')

  expect(handler).toHaveBeenCalledWith({ uid: 1 }, 'slime')
  expect(ViewletManager.render).toHaveBeenCalledTimes(1)
  expect(result).toEqual({
    commands: [['render.1']],
    newState: {
      ...state,
    },
  })
})

test('handleActiveEditorChange forwards the active uri to loaded viewlets', async () => {
  const handler = jest.fn((state: { uid: number }, activeUri: string) => {
    return {
      ...state,
      activeUri,
    }
  })
  ViewletStates.set('problems', createInstance(1, 'handleActiveEditorChange', handler))

  const state = ViewletLayout.create(1)
  const result = await ViewletLayout.handleActiveEditorChange(state, 'file:///test.ts')

  expect(handler).toHaveBeenCalledWith({ uid: 1 }, 'file:///test.ts')
  expect(ViewletManager.render).toHaveBeenCalledTimes(1)
  expect(result).toEqual({
    commands: [['render.1']],
    newState: {
      ...state,
    },
  })
})

test('handleActiveEditorChange ignores viewlets that are not loaded', async () => {
  const state = ViewletLayout.create(1)

  const result = await ViewletLayout.handleActiveEditorChange(state, 'file:///test.ts')

  expect(ViewletManager.render).not.toHaveBeenCalled()
  expect(result).toEqual({
    commands: [],
    newState: {
      ...state,
    },
  })
})

test('handleActiveEditorChange refreshes the problems summary for loaded viewlets', async () => {
  const summary = {
    errorCount: 2,
    hasEditor: true,
    problemCount: 5,
    warningCount: 1,
  }
  problemsInvoke.mockResolvedValueOnce(summary)
  const panelHandler = jest.fn((state: { uid: number }, receivedSummary) => ({
    ...state,
    summary: receivedSummary,
  }))
  const statusBarHandler = jest.fn((state: { uid: number }, receivedSummary) => ({
    ...state,
    summary: receivedSummary,
  }))
  ViewletStates.set('panel', createInstance(1, 'handleProblemsSummaryChange', panelHandler))
  ViewletStates.set('status-bar', createInstance(2, 'handleProblemsSummaryChange', statusBarHandler))

  const state = ViewletLayout.create(1)
  const result = await ViewletLayout.handleActiveEditorChange(state, 'file:///test.ts')

  expect(problemsInvoke).toHaveBeenCalledWith('Problems.getProblemsSummary')
  expect(panelHandler).toHaveBeenCalledWith({ uid: 1 }, summary)
  expect(statusBarHandler).toHaveBeenCalledWith({ uid: 2 }, summary)
  expect(result).toEqual({
    commands: [['render.1'], ['render.2']],
    newState: {
      ...state,
    },
  })
})

test('handleDiagnosticsChange forwards the changed uri to loaded viewlets', async () => {
  const handler = jest.fn((state: { uid: number }, uri: string) => {
    return {
      ...state,
      refreshedUri: uri,
    }
  })
  ViewletStates.set('problems', createInstance(1, 'handleDiagnosticsChange', handler))

  const state = ViewletLayout.create(1)
  const result = await ViewletLayout.handleDiagnosticsChange(state, 'file:///test.ts')

  expect(handler).toHaveBeenCalledWith({ uid: 1 }, 'file:///test.ts')
  expect(ViewletManager.render).toHaveBeenCalledTimes(1)
  expect(result).toEqual({
    commands: [['render.1']],
    newState: {
      ...state,
    },
  })
})

test('handleDiagnosticsChange keeps the viewlet update when refreshing the problems summary fails', async () => {
  problemsInvoke.mockRejectedValueOnce(new Error('Failed to query problems'))
  const handler = jest.fn((state: { uid: number }, uri: string) => ({
    ...state,
    refreshedUri: uri,
  }))
  ViewletStates.set('problems', createInstance(1, 'handleDiagnosticsChange', handler))

  const state = ViewletLayout.create(1)
  const result = await ViewletLayout.handleDiagnosticsChange(state, 'file:///test.ts')

  expect(handler).toHaveBeenCalledWith({ uid: 1 }, 'file:///test.ts')
  expect(result).toEqual({
    commands: [['render.1']],
    newState: {
      ...state,
    },
  })
})

test('handleSettingsChanged hydrates preferences and updates viewlet state', async () => {
  const calls: string[] = []
  hydratePreferences.mockImplementation(async () => {
    calls.push('hydrate')
  })
  const handler = jest.fn((state: { uid: number }) => {
    calls.push('handleSettingsChanged')
    return {
      ...state,
      lineNumbers: false,
    }
  })
  ViewletStates.set('editor', createInstance(1, 'handleSettingsChanged', handler))

  const state = ViewletLayout.create(1)
  const result = await ViewletLayout.handleSettingsChanged(state)

  expect(calls).toEqual(['hydrate', 'handleSettingsChanged'])
  expect(ViewletStates.getInstance('editor').state).toEqual({
    lineNumbers: false,
    uid: 1,
  })
  expect(result).toEqual({
    commands: [['render.1']],
    newState: {
      ...state,
    },
  })
})
