import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/BlobSrc/BlobSrc.js', () => {
  return {
    getSrc(uri) {
      return '/remote' + uri
    },
    disposeSrc: jest.fn(),
  }
})

const ViewletAudio = await import('../src/parts/ViewletAudio/ViewletAudio.js')
const BlobSrc = await import('../src/parts/BlobSrc/BlobSrc.js')

test('create', () => {
  const state = ViewletAudio.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = {
    ...ViewletAudio.create(),
    uri: '/test.mp3',
  }
  expect(await ViewletAudio.loadContent(state)).toMatchObject({
    src: '/remote/test.mp3',
  })
})

test('dispose', async () => {
  // @ts-ignore
  BlobSrc.disposeSrc.mockImplementation(() => {})
  const state = {
    ...ViewletAudio.create(),
    src: '/remote/test.mp3',
  }
  await ViewletAudio.dispose(state)
  expect(BlobSrc.disposeSrc).toBeCalledTimes(1)
  expect(BlobSrc.disposeSrc).toHaveBeenCalledWith('/remote/test.mp3')
})
