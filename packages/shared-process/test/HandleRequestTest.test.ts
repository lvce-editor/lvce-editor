import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/GetTestRequestResponse/GetTestRequestResponse.js', () => ({
  getTestRequestResponse: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/HttpServerResponse/HttpServerResponse.js', () => ({
  send: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const GetTestRequestResponse = await import('../src/parts/GetTestRequestResponse/GetTestRequestResponse.js')
const HandleRequestTest = await import('../src/parts/HandleRequestTest/HandleRequestTest.js')
const HttpServerResponse = await import('../src/parts/HttpServerResponse/HttpServerResponse.js')

test('handleRequestTest', async () => {
  const request = {}
  const indexHtmlPath = '/test/index.html'
  const socket = {}
  jest.spyOn(GetTestRequestResponse, 'getTestRequestResponse').mockResolvedValue({
    body: 'test',
    init: {
      status: 200,
    },
  })
  jest.spyOn(HttpServerResponse, 'send').mockImplementation(() => {})
  await HandleRequestTest.handleRequestTest(request, indexHtmlPath, socket)
  expect(HttpServerResponse.send).toHaveBeenCalledTimes(1)
  expect(HttpServerResponse.send).toHaveBeenCalledWith({}, {}, { body: 'test', init: { status: 200 } })
})
