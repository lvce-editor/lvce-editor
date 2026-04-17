import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Id/Id.js', () => {
  return {
    create: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/SaveState/SaveState.js', () => {
  return {
    saveViewletState: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => {
  return {
    disposeFunctional: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => {
  return {
    load: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Id = await import('../src/parts/Id/Id.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const SaveState = await import('../src/parts/SaveState/SaveState.js')
const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const ViewletSideBar = await import('../src/parts/ViewletSideBar/ViewletSideBar.js')

beforeEach(() => {
  jest.resetAllMocks()
})

const createDeferred = () => {
  /** @type {(value: any) => void} */
  let resolve = () => {}
  const promise = new Promise((res) => {
    resolve = res
  })
  return { promise, resolve }
}

test('handleSideBarViewletChange ignores stale loads', async () => {
  const explorerDeferred = createDeferred()
  const sourceControlDeferred = createDeferred()
  // @ts-ignore
  Id.create.mockReturnValueOnce(101).mockReturnValueOnce(201).mockReturnValueOnce(102).mockReturnValueOnce(202)
  // @ts-ignore
  SaveState.saveViewletState.mockResolvedValue(undefined)
  // @ts-ignore
  RendererProcess.invoke.mockResolvedValue(undefined)
  // @ts-ignore
  Viewlet.disposeFunctional.mockReturnValue([])
  // @ts-ignore
  ViewletManager.load.mockImplementation(async ({ id }) => {
    switch (id) {
      case 'Explorer':
        return explorerDeferred.promise
      case 'SourceControl':
        return sourceControlDeferred.promise
      default:
        throw new Error(`unexpected module id: ${id}`)
    }
  })
  const state = ViewletSideBar.create(1, '', 0, 0, 300, 600)

  const explorerPromise = ViewletSideBar.handleSideBarViewletChange(state, 'Explorer')
  const sourceControlPromise = ViewletSideBar.handleSideBarViewletChange(state, 'SourceControl')

  sourceControlDeferred.resolve([
    ['noop'],
    ['Viewlet.send', 1, 'setActionsDom', ['source-control-actions']],
    ['Viewlet.registerEventListeners', 1, ['click']],
  ])
  explorerDeferred.resolve([['noop'], ['Viewlet.send', 1, 'setActionsDom', ['explorer-actions']], ['Viewlet.registerEventListeners', 1, ['click']]])

  const sourceControlResult = await sourceControlPromise
  const explorerResult = await explorerPromise

  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [
    ['noop'],
    ['Viewlet.registerEventListeners', 1, ['click']],
    ['Viewlet.createFunctionalRoot', 'SourceControl', 102, true],
    ['Viewlet.registerEventListeners', 102, ['click']],
    ['Viewlet.setDom2', 102, ['source-control-actions']],
    ['Viewlet.setUid', 102, 201],
  ])
  expect(Viewlet.disposeFunctional).toHaveBeenCalledTimes(1)
  expect(Viewlet.disposeFunctional).toHaveBeenCalledWith(101)
  expect(sourceControlResult).toEqual({
    ...state,
    actionsUid: 102,
    childUid: 201,
    currentViewletId: 'SourceControl',
  })
  expect(explorerResult.currentViewletId).toBe('SourceControl')
})
