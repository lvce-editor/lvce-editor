import { beforeEach, expect, jest, test } from '@jest/globals'

const hydratePreferences = jest.fn()

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => {
  return {
    get: jest.fn(),
    hydrate: hydratePreferences,
    update: jest.fn(),
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
