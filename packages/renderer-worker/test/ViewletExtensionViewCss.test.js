import { beforeEach, expect, jest, test } from '@jest/globals'

const extensionViews = {
  view: {
    css: '/extensions/sample/view.css',
    extensionId: 'sample.extension',
    icon: '',
    id: 'sample.views.testing',
    kind: 'virtualDom',
    title: 'Testing',
  },
}

beforeEach(() => {
  jest.clearAllMocks()
  globalThis.fetch = /** @type {any} */ (
    jest.fn(async () => {
      return {
        ok: true,
        text: async () => '.Testing { color: red; }',
      }
    })
  )
})

jest.unstable_mockModule('../src/parts/GetExtensionViews/GetExtensionViews.ts', () => {
  return {
    getExtensionView: jest.fn(async () => extensionViews.view),
  }
})

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => {
  return {
    invoke: jest.fn(async () => {
      return {
        dom: [],
        type: 'setDom',
      }
    }),
  }
})

const ViewletExtensionView = await import('../src/parts/ViewletExtensionView/ViewletExtensionView.ts')
const ViewletExtensionViewRender = await import('../src/parts/ViewletExtensionView/ViewletExtensionViewRender.ts')

test('loadContent loads css from extension view metadata', async () => {
  const state = ViewletExtensionView.create(1, 'sample.views.testing', 0, 0, 100, 100)

  const newState = await ViewletExtensionView.loadContent(state, undefined)

  expect(fetch).toHaveBeenCalledWith('/extensions/sample/view.css')
  expect(newState.css).toBe('.Testing { color: red; }')
  expect(newState.cssId).toBe('ExtensionView:sample.views.testing')
})

test('loadContent ignores css load errors', async () => {
  globalThis.fetch = /** @type {any} */ (
    jest.fn(async () => {
      throw new Error('not found')
    })
  )
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const state = ViewletExtensionView.create(1, 'sample.views.testing', 0, 0, 100, 100)

  const newState = await ViewletExtensionView.loadContent(state, undefined)

  expect(newState.css).toBe('')
  expect(newState.cssId).toBe('')
  expect(warn).toHaveBeenCalledWith(expect.stringContaining('Failed to load css for extension view sample.views.testing'))
  warn.mockRestore()
})

test('render emits set css command', () => {
  const oldState = {
    css: '',
    cssId: '',
  }
  const newState = {
    css: '.Testing { color: red; }',
    cssId: 'ExtensionView:sample.views.testing',
  }

  expect(ViewletExtensionViewRender.render[3].apply(/** @type {any} */ (oldState), /** @type {any} */ (newState))).toEqual([
    ['Viewlet.setCss', 'ExtensionView:sample.views.testing', '.Testing { color: red; }'],
  ])
})
