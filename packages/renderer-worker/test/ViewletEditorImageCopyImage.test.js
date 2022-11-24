import { jest } from '@jest/globals'

beforeAll(() => {
  // @ts-ignore
  globalThis.DOMMatrix = class {}
  // @ts-ignore
  globalThis.DOMMatrixReadOnly = class {}
})

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(),
  }
})

const Command = await import('../src/parts/Command/Command.js')
const ViewletEditorImage = await import(
  '../src/parts/ViewletEditorImage/ViewletEditorImage.js'
)
const ViewletEditorImageCopyImage = await import(
  '../src/parts/ViewletEditorImage/ViewletEditorImageCopyImage.js'
)

test('copyImage', async () => {
  // @ts-ignore
  Command.execute.mockImplementation((method) => {
    switch (method) {
      case 'Ajax.getBlob':
        return {
          type: 'image/png',
        }
      default:
        return
    }
  })
  const state = { ...ViewletEditorImage.create(), src: '/test/file.png' }
  expect(await ViewletEditorImageCopyImage.copyImage(state)).toBe(state)
  expect(Command.execute).toHaveBeenCalledTimes(2)
  expect(Command.execute).toHaveBeenNthCalledWith(
    1,
    'Ajax.getBlob',
    '/test/file.png'
  )
  expect(Command.execute).toHaveBeenNthCalledWith(2, 'ClipBoard.writeImage', {
    type: 'image/png',
  })
})
