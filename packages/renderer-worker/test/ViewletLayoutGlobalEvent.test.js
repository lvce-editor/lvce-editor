import { beforeEach, expect, jest, test } from '@jest/globals'

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
    resolve = resolvePromise
  })
  return {
    promise,
    resolve,
  }
}

const createInstance = (uid, handler) => {
  const state = {
    uid,
  }
  return {
    factory: {
      Commands: {
        handleWorkspaceRefresh: handler,
      },
    },
    moduleId: `Test${uid}`,
    renderedState: state,
    state,
  }
}

test('handleWorkspaceRefresh runs global event handlers in parallel', async () => {
  const calls = []
  const first = createDeferred()
  const second = createDeferred()
  ViewletStates.set(
    'first',
    createInstance(1, async (state) => {
      calls.push('first:start')
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
    createInstance(2, async (state) => {
      calls.push('second:start')
      await second.promise
      calls.push('second:end')
      return {
        ...state,
        refreshed: true,
      }
    }),
  )

  const state = ViewletLayout.create(1)
  const resultPromise = ViewletLayout.handleWorkspaceRefresh(state)

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
