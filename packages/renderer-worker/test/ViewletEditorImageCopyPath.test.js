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
const ViewletEditorImageCopyPath = await import(
  '../src/parts/ViewletEditorImage/ViewletEditorImageCopyPath.js'
)

test('copyPath', async () => {
  const state = {
    ...ViewletEditorImage.create(),
    uri: '/test/file.jpg',
  }
  await ViewletEditorImageCopyPath.copyPath(state)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'ClipBoard.writeText',
    '/test/file.jpg'
  )
})
