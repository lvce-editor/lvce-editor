import { expect, test } from '@jest/globals'
import { findExtensionView } from '../src/parts/GetExtensionViews/GetExtensionViews.ts'

const views = [
  {
    extensionId: 'builtin.media-preview',
    icon: '',
    id: 'builtin.media-preview',
    selector: ['.png', '.jpg'],
    title: 'Media Preview',
    type: 'preview',
  },
  {
    extensionId: 'sample.extension',
    icon: '',
    id: 'sample.views.testing',
    selector: ['.test'],
    title: 'Testing',
  },
]

test('findExtensionView finds a view by id', () => {
  expect(findExtensionView(views, 'sample.views.testing')?.id).toBe('sample.views.testing')
})

test('findExtensionView finds preview views by document selector', () => {
  expect(findExtensionView(views, 'file:///workspace/image.png')?.id).toBe('builtin.media-preview')
})

test('findExtensionView does not use sidebar view selectors for documents', () => {
  expect(findExtensionView(views, 'file:///workspace/file.test')).toBeUndefined()
})
