import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn(async (method) => {
  if (method === 'Extensions.getViews') {
    return [
      {
        extensionId: 'sample.extension',
        icon: '',
        id: 'sample.views.testing',
        kind: 'virtualDom',
        title: 'Testing',
      },
    ]
  }
  if (method === 'Extensions.getAllExtensions') {
    return [
      {
        id: 'sample.extension',
        isWeb: true,
        path: '/extensions/sample.extension',
        views: [
          {
            css: 'view.css',
            id: 'sample.views.testing',
          },
        ],
      },
    ]
  }
  throw new Error(`unexpected method ${method}`)
})

beforeEach(() => {
  invoke.mockClear()
})

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => {
  return {
    invoke,
  }
})

const GetExtensionViews = await import('../src/parts/GetExtensionViews/GetExtensionViews.ts')

test('getExtensionViews merges css from extension manifest', async () => {
  await expect(GetExtensionViews.getExtensionViews()).resolves.toEqual([
    {
      css: '/extensions/sample.extension/view.css',
      extensionId: 'sample.extension',
      icon: '',
      id: 'sample.views.testing',
      kind: 'virtualDom',
      title: 'Testing',
    },
  ])
})
