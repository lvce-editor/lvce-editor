import { beforeEach, expect, jest, test } from '@jest/globals'

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

const ViewletVideo = await import('../src/parts/ViewletVideo/ViewletVideo.ts')
const BlobSrc = await import('../src/parts/BlobSrc/BlobSrc.js')

test('create', () => {
  // @ts-ignore
  const state = ViewletVideo.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = {
    // @ts-ignore
    ...ViewletVideo.create(),
    uri: '/test.mp4',
  }
  expect(await ViewletVideo.loadContent(state)).toMatchObject({
    src: '/remote/test.mp4',
  })
})

test('dispose', async () => {
  // @ts-ignore
  BlobSrc.disposeSrc.mockImplementation(() => {})
  const state = {
    // @ts-ignore
    ...ViewletVideo.create(),
    src: '/remote/test.mp4',
  }
  await ViewletVideo.dispose(state)
  expect(BlobSrc.disposeSrc).toBeCalledTimes(1)
  expect(BlobSrc.disposeSrc).toHaveBeenCalledWith('/remote/test.mp4')
})
