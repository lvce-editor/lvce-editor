import { expect, jest, test } from '@jest/globals'

const state = {
  views: [] as any[],
  webViews: [] as any[],
}

jest.unstable_mockModule('../src/parts/GetExtensionViews/GetExtensionViews.ts', () => ({
  findExtensionView(views, idOrUri) {
    return (
      views.find((view) => view.id === idOrUri) ||
      views.find((view) => view.type === 'preview' && view.selector?.some((selector) => idOrUri.endsWith(selector)))
    )
  },
  getExtensionViews: jest.fn(async () => state.views),
}))

jest.unstable_mockModule('../src/parts/GetWebViews/GetWebViews.ts', () => ({
  getWebViews: jest.fn(async () => state.webViews),
}))

const ViewletMap = await import('../src/parts/ViewletMap/ViewletMap.js')
const ViewletModuleId = await import('../src/parts/ViewletModuleId/ViewletModuleId.js')

test('image documents use a matching preview extension view', async () => {
  state.views = [
    {
      id: 'builtin.media-preview',
      selector: ['.png', '.jpg'],
      type: 'preview',
    },
  ]

  await expect(ViewletMap.getModuleId('/workspace/image.png')).resolves.toBe(ViewletModuleId.ExtensionView)
})

test('sidebar view selectors do not claim documents', async () => {
  state.views = [
    {
      id: 'sample.views.testing',
      selector: ['.test'],
    },
  ]

  await expect(ViewletMap.getModuleId('/workspace/file.test')).resolves.toBe(ViewletModuleId.EditorText)
})

test('an explicit extension view opener uses the extension view renderer', async () => {
  state.views = [
    {
      id: 'builtin.media-preview',
      selector: ['.png'],
      type: 'preview',
    },
  ]

  await expect(ViewletMap.getModuleId('/workspace/file.unknown', 'builtin.media-preview')).resolves.toBe(ViewletModuleId.ExtensionView)
})

test('an explicit extension view opener overrides the default JSON editor', async () => {
  state.views = [
    {
      id: 'builtin.cpu-profile-view',
      selector: ['.json'],
      type: 'preview',
    },
  ]

  await expect(ViewletMap.getModuleId('/workspace/profile.json', 'builtin.cpu-profile-view')).resolves.toBe(ViewletModuleId.ExtensionView)
})

test('an explicit webview opener overrides the default JSON editor', async () => {
  state.views = []
  state.webViews = [
    {
      id: 'builtin.json-preview',
      selector: ['.json'],
    },
  ]

  await expect(ViewletMap.getModuleId('/workspace/file.json', 'builtin.json-preview')).resolves.toBe(ViewletModuleId.WebView)
})

test('video documents use a matching preview extension view', async () => {
  state.views = [
    {
      id: 'builtin.video-preview',
      selector: ['.mp4', '.avi', '.webm'],
      type: 'preview',
    },
  ]

  await expect(ViewletMap.getModuleId('/workspace/video.mp4')).resolves.toBe(ViewletModuleId.ExtensionView)
})

test('video documents use a matching legacy webview provider', async () => {
  state.views = []
  state.webViews = [
    {
      id: 'builtin.video-preview',
      selector: ['.mp4', '.avi', '.webm'],
    },
  ]

  await expect(ViewletMap.getModuleId('/workspace/video.mp4')).resolves.toBe(ViewletModuleId.WebView)
})
