import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/MainAreaWorker/MainAreaWorker.js', () => {
  return {
    invoke: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => {
  return {
    get: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/ResolveInternalSourceUri/ResolveInternalSourceUri.ts', () => {
  return {
    resolveInternalSourceUri: jest.fn(async (uri: string) => uri),
  }
})

const MainAreaWorker = await import('../src/parts/MainAreaWorker/MainAreaWorker.js')
const Preferences = await import('../src/parts/Preferences/Preferences.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const ResolveInternalSourceUri = await import('../src/parts/ResolveInternalSourceUri/ResolveInternalSourceUri.ts')
const { wrapMainAreaCommand } = await import('../src/parts/WrapMainAreaCommand/WrapMainAreaCommand.ts')

const state = {
  uid: 7,
}

beforeEach(() => {
  jest.useFakeTimers()
  jest.resetAllMocks()
  // @ts-ignore
  Preferences.get.mockReturnValue(false)
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue(undefined)
  // @ts-ignore
  ResolveInternalSourceUri.resolveInternalSourceUri.mockImplementation(async (uri: string) => uri)
})

afterEach(() => {
  jest.useRealTimers()
})

test('returns final render commands for a fast open', async () => {
  const finalCommands = [['Viewlet.setDom2', 7, ['content']]]
  // @ts-ignore
  Preferences.get.mockReturnValue(true)
  // @ts-ignore
  MainAreaWorker.invoke.mockImplementation((method) => {
    if (method === 'MainArea.diff2') {
      return [2]
    }
    if (method === 'MainArea.render2') {
      return finalCommands
    }
    return undefined
  })

  const result = await wrapMainAreaCommand('openUri')(state, 'file:///test.txt')
  await jest.advanceTimersByTimeAsync(500)

  expect(result).toEqual({
    ...state,
    commands: finalCommands,
  })
  expect(RendererProcess.invoke).not.toHaveBeenCalled()
})

test('resolves an internal URI before opening it in the main area worker', async () => {
  const options = {
    focus: true,
    uri: 'lvce://-/abc123/extensions/typescript/lib/lib.es5.d.ts',
  }
  // @ts-ignore
  ResolveInternalSourceUri.resolveInternalSourceUri.mockResolvedValue(
    'file:///usr/lib/lvce/resources/app/static/abc123/extensions/typescript/lib/lib.es5.d.ts',
  )
  // @ts-ignore
  MainAreaWorker.invoke.mockResolvedValue([])

  await wrapMainAreaCommand('openUri')(state, options)

  expect(ResolveInternalSourceUri.resolveInternalSourceUri).toHaveBeenCalledWith(options.uri)
  expect(MainAreaWorker.invoke).toHaveBeenNthCalledWith(1, 'MainArea.openUri', state.uid, {
    ...options,
    uri: 'file:///usr/lib/lvce/resources/app/static/abc123/extensions/typescript/lib/lib.es5.d.ts',
  })
})

test('renders a pending loading state after 500ms and returns the final render', async () => {
  const open = Promise.withResolvers()
  const loadingCommands = [['Viewlet.setDom2', 7, ['Loading...']]]
  const finalCommands = [['Viewlet.setDom2', 7, ['content']]]
  let diffCount = 0
  // @ts-ignore
  Preferences.get.mockReturnValue(true)
  // @ts-ignore
  MainAreaWorker.invoke.mockImplementation((method) => {
    if (method === 'MainArea.openUri') {
      return open.promise
    }
    if (method === 'MainArea.diff2') {
      diffCount++
      return diffCount === 1 ? [1] : [2]
    }
    if (method === 'MainArea.render2') {
      return diffCount === 1 ? loadingCommands : finalCommands
    }
    return undefined
  })

  const resultPromise = wrapMainAreaCommand('openUri')(state, 'file:///test.txt')
  await jest.advanceTimersByTimeAsync(500)

  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', loadingCommands)

  open.resolve(undefined)
  await expect(resultPromise).resolves.toEqual({
    ...state,
    commands: finalCommands,
  })
})

test('does not schedule a loading render when the preference is disabled', async () => {
  const open = Promise.withResolvers()
  const finalCommands = [['Viewlet.setDom2', 7, ['content']]]
  // @ts-ignore
  MainAreaWorker.invoke.mockImplementation((method) => {
    if (method === 'MainArea.openUri') {
      return open.promise
    }
    if (method === 'MainArea.diff2') {
      return [2]
    }
    if (method === 'MainArea.render2') {
      return finalCommands
    }
    return undefined
  })

  const resultPromise = wrapMainAreaCommand('openUri')(state, 'file:///test.txt')
  await jest.advanceTimersByTimeAsync(500)

  expect(MainAreaWorker.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).not.toHaveBeenCalled()

  open.resolve(undefined)
  await expect(resultPromise).resolves.toEqual({
    ...state,
    commands: finalCommands,
  })
})

test('does not schedule a loading render for unrelated commands', async () => {
  const close = Promise.withResolvers()
  // @ts-ignore
  Preferences.get.mockReturnValue(true)
  // @ts-ignore
  MainAreaWorker.invoke.mockImplementation((method) => {
    if (method === 'MainArea.closeAll') {
      return close.promise
    }
    return []
  })

  const resultPromise = wrapMainAreaCommand('closeAll')(state)
  await jest.advanceTimersByTimeAsync(500)

  expect(MainAreaWorker.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).not.toHaveBeenCalled()

  close.resolve(undefined)
  await expect(resultPromise).resolves.toBe(state)
})

test('continues waiting when the pending state has no render diff', async () => {
  const open = Promise.withResolvers()
  const finalCommands = [['Viewlet.setDom2', 7, ['content']]]
  let diffCount = 0
  // @ts-ignore
  Preferences.get.mockReturnValue(true)
  // @ts-ignore
  MainAreaWorker.invoke.mockImplementation((method) => {
    if (method === 'MainArea.openUri') {
      return open.promise
    }
    if (method === 'MainArea.diff2') {
      diffCount++
      return diffCount === 1 ? [] : [2]
    }
    if (method === 'MainArea.render2') {
      return finalCommands
    }
    return undefined
  })

  const resultPromise = wrapMainAreaCommand('openUri')(state, 'file:///test.txt')
  await jest.advanceTimersByTimeAsync(500)

  expect(RendererProcess.invoke).not.toHaveBeenCalled()

  open.resolve(undefined)
  await expect(resultPromise).resolves.toEqual({
    ...state,
    commands: finalCommands,
  })
})

test('clears the timeout when opening fails before the delay', async () => {
  const error = new Error('Failed to open')
  // @ts-ignore
  Preferences.get.mockReturnValue(true)
  // @ts-ignore
  MainAreaWorker.invoke.mockRejectedValue(error)

  await expect(wrapMainAreaCommand('openUri')(state, 'file:///test.txt')).rejects.toThrow(error)
  await jest.advanceTimersByTimeAsync(500)

  expect(MainAreaWorker.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).not.toHaveBeenCalled()
})

test('renders pending state for tab selection commands', async () => {
  const select = Promise.withResolvers()
  const loadingCommands = [['Viewlet.setDom2', 7, ['Loading...']]]
  // @ts-ignore
  Preferences.get.mockReturnValue(true)
  // @ts-ignore
  MainAreaWorker.invoke.mockImplementation((method) => {
    if (method === 'MainArea.selectTab') {
      return select.promise
    }
    if (method === 'MainArea.diff2') {
      return [1]
    }
    if (method === 'MainArea.render2') {
      return loadingCommands
    }
    return undefined
  })

  const resultPromise = wrapMainAreaCommand('selectTab')(state, 0, 1)
  await jest.advanceTimersByTimeAsync(500)

  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', loadingCommands)

  select.resolve(undefined)
  await resultPromise
})
