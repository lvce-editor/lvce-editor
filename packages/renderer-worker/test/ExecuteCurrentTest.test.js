import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/GetTestFilePath/GetTestFilePath.js', () => ({
  getTestFilePath: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/Test/Test.js', () => ({
  execute: jest.fn(),
  executeAll: jest.fn(),
}))

const ExecuteCurrentTest = await import('../src/parts/ExecuteCurrentTest/ExecuteCurrentTest.js')
const GetTestFilePath = await import('../src/parts/GetTestFilePath/GetTestFilePath.js')
const Test = await import('../src/parts/Test/Test.js')

test('executeCurrentTest executes a single test', async () => {
  jest.spyOn(GetTestFilePath, 'getTestFilePath').mockResolvedValue('/remote/test/src/sample.js')

  await ExecuteCurrentTest.executeCurrentTest(1, {
    Location: {
      href: 'http://localhost:3000/tests/sample.html',
    },
  })

  expect(GetTestFilePath.getTestFilePath).toHaveBeenCalledWith(1, 'http://localhost:3000/tests/sample.html')
  expect(Test.execute).toHaveBeenCalledWith('/remote/test/src/sample.js')
  expect(Test.executeAll).not.toHaveBeenCalled()
})

test('executeCurrentTest runs all tests for _all.html', async () => {
  globalThis.fetch = /** @type {any} */ (
    jest.fn(async () => ({
      text: async () => `
<!DOCTYPE html>
<a href="./sample-a.html">sample-a</a>
<a href="./sample-b.html">sample-b</a>
`,
    }))
  )
  jest
    .spyOn(GetTestFilePath, 'getTestFilePath')
    .mockResolvedValueOnce('/remote/test/src/sample-a.js')
    .mockResolvedValueOnce('/remote/test/src/sample-b.js')
  const href = 'http://localhost:3000/tests/_all.html'

  await ExecuteCurrentTest.executeCurrentTest(1, {
    Location: {
      href,
    },
  })

  expect(fetch).toHaveBeenCalledWith('http://localhost:3000/tests/')
  expect(Test.executeAll).toHaveBeenCalledWith(
    [
      {
        name: 'sample-a.js',
        url: '/remote/test/src/sample-a.js',
      },
      {
        name: 'sample-b.js',
        url: '/remote/test/src/sample-b.js',
      },
    ],
    href,
  )
  expect(Test.execute).not.toHaveBeenCalled()
})

test('executeCurrentTest filters tests for _all.html', async () => {
  globalThis.fetch = /** @type {any} */ (
    jest.fn(async () => ({
      text: async () => `
<!DOCTYPE html>
<a href="./sample-a.html">sample-a</a>
<a href="./sample-b.html">sample-b</a>
`,
    }))
  )
  jest.spyOn(GetTestFilePath, 'getTestFilePath').mockResolvedValue('/remote/test/src/sample-b.js')
  const href = 'http://localhost:3000/tests/_all.html?filter=b'

  await ExecuteCurrentTest.executeCurrentTest(1, {
    Location: {
      href,
    },
  })

  expect(GetTestFilePath.getTestFilePath).toHaveBeenCalledTimes(1)
  expect(GetTestFilePath.getTestFilePath).toHaveBeenCalledWith(1, 'http://localhost:3000/tests/sample-b.html')
  expect(Test.executeAll).toHaveBeenCalledWith(
    [
      {
        name: 'sample-b.js',
        url: '/remote/test/src/sample-b.js',
      },
    ],
    href,
  )
})
