import { expect, jest, test } from '@jest/globals'

const getModuleId = jest.fn(async (_uri?: string, _opener?: string) => 'WebView')

jest.unstable_mockModule('../src/parts/ViewletMap/ViewletMap.js', () => ({
  getModuleId,
}))

const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')

test('forwards explicit opener when resolving viewlet module id', async () => {
  const state = ViewletLayout.create(1)

  await expect(ViewletLayout.getModuleId(state, '/workspace/readme.md', 'builtin.markdown-preview')).resolves.toBe('WebView')
  expect(getModuleId).toHaveBeenCalledWith('/workspace/readme.md', 'builtin.markdown-preview')
})
