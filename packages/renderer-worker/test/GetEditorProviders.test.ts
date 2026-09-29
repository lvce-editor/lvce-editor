import { expect, jest, test } from '@jest/globals'

const state = {
  extensionViews: [] as any[],
  webViews: [] as any[],
}

jest.unstable_mockModule('../src/parts/GetExtensionViews/GetExtensionViews.ts', () => ({
  getExtensionViews: jest.fn(async () => state.extensionViews),
}))

jest.unstable_mockModule('../src/parts/GetWebViews/GetWebViews.ts', () => ({
  getWebViews: jest.fn(async () => state.webViews),
}))

const { getEditorProviders } = await import('../src/parts/GetEditorProviders/GetEditorProviders.ts')

test('returns legacy webviews and modern preview views', async () => {
  state.webViews = [{ id: 'builtin.markdown-preview', selector: ['.md'] }]
  state.extensionViews = [
    { id: 'builtin.media-preview', selector: ['.png'], title: 'Media Preview', type: 'preview' },
    { id: 'sample.sidebar', selector: ['.png'], title: 'Sidebar' },
  ]

  await expect(getEditorProviders()).resolves.toEqual([
    { id: 'builtin.markdown-preview', selector: ['.md'] },
    { id: 'builtin.media-preview', selector: ['.png'], title: 'Media Preview', type: 'preview' },
  ])
})

test('uses the modern preview contribution when provider ids overlap', async () => {
  state.webViews = [{ id: 'builtin.media-preview', name: 'Legacy Media Preview', selector: ['.png'] }]
  state.extensionViews = [{ id: 'builtin.media-preview', selector: ['.png'], title: 'Media Preview', type: 'preview' }]

  await expect(getEditorProviders()).resolves.toEqual([{ id: 'builtin.media-preview', selector: ['.png'], title: 'Media Preview', type: 'preview' }])
})
