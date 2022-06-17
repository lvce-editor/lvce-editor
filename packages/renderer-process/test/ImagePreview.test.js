/**
 * @jest-environment jsdom
 */
import * as ImagePreview from '../src/parts/ImagePreview/ImagePreview.js'

test('create', () => {
  const state = ImagePreview.create('/remote/tmp/image.png', 10, 20)
  expect(state.$ImagePreview).toBeDefined()
  expect(state.$ImagePreview.isConnected).toBe(true)
  expect(state.$ImagePreviewImage.src).toBe(
    'http://localhost/remote/tmp/image.png'
  )
  expect(state.$ImagePreviewCaption.textContent).toBe('')
})

test('create - image loads', () => {
  const state = ImagePreview.create('/remote/tmp/image.png', 10, 20)
  expect(state.$ImagePreview).toBeDefined()
  expect(state.$ImagePreview.isConnected).toBe(true)
  expect(state.$ImagePreviewImage.src).toBe(
    'http://localhost/remote/tmp/image.png'
  )
  state.$ImagePreviewImage.dispatchEvent(new Event('load', { bubbles: true }))
  expect(state.$ImagePreviewCaption.textContent).toBe('0 × 0')
})

test('create - error with loading image', () => {
  const state = ImagePreview.create('/remote/tmp/image.png', 10, 20)
  expect(state.$ImagePreview).toBeDefined()
  expect(state.$ImagePreview.isConnected).toBe(true)
  expect(state.$ImagePreviewImage.src).toBe(
    'http://localhost/remote/tmp/image.png'
  )
  state.$ImagePreviewImage.dispatchEvent(
    new ErrorEvent('error', { bubbles: true })
  )
  expect(state.$ImagePreviewCaption.textContent).toBe(
    'Image could not be loaded'
  )
})

test('showError', () => {
  const state = ImagePreview.showError('Image could not be loaded', 10, 20)
  expect(state.$ImagePreview).toBeDefined()
  expect(state.$ImagePreview.isConnected).toBe(true)
  expect(state.$ImagePreviewCaption.textContent).toBe(
    'Image could not be loaded'
  )
})
